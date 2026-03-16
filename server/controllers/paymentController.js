import SSLCommerzPayment from 'sslcommerz-lts';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { clearCart } from './cartController.js';

const getSslClient = () => {
  if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
    throw new Error('SSLCommerz credentials are not configured');
  }

  return new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASSWORD,
    process.env.SSLCOMMERZ_IS_LIVE === 'true'
  );
};

const validateShippingAddress = (shippingAddress) => {
  const requiredFields = ['line1', 'city', 'state', 'postalCode', 'country'];

  for (const field of requiredFields) {
    if (!shippingAddress?.[field]) {
      return false;
    }
  }

  return true;
};

const createOrderFromCart = async ({ userId, cart, shippingAddress, paymentMethod, transactionId = '' }) => {
  const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return Order.create({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      size: item.size,
      quantity: item.quantity,
    })),
    totalPrice,
    paymentMethod,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    shippingAddress,
    transactionId,
  });
};

const initPayment = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (!validateShippingAddress(shippingAddress)) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const transactionId = `VORCE-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const order = await createOrderFromCart({
    userId: req.user._id,
    cart,
    shippingAddress,
    paymentMethod: 'SSLCommerz',
    transactionId,
  });

  const sslClient = getSslClient();
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const paymentPayload = {
    total_amount: Number(order.totalPrice.toFixed(2)),
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${baseUrl}/api/payment/success`,
    fail_url: `${baseUrl}/api/payment/fail`,
    cancel_url: `${baseUrl}/api/payment/cancel`,
    ipn_url: `${baseUrl}/api/payment/ipn`,
    shipping_method: 'NO',
    product_name: 'VORCE Order',
    product_category: 'Fashion',
    product_profile: 'general',
    cus_name: req.user.name,
    cus_email: req.user.email,
    cus_add1: shippingAddress.line1,
    cus_add2: shippingAddress.line2 || '',
    cus_city: shippingAddress.city,
    cus_state: shippingAddress.state,
    cus_postcode: shippingAddress.postalCode,
    cus_country: shippingAddress.country,
    cus_phone: '00000000000',
    ship_name: req.user.name,
    ship_add1: shippingAddress.line1,
    ship_add2: shippingAddress.line2 || '',
    ship_city: shippingAddress.city,
    ship_state: shippingAddress.state,
    ship_postcode: shippingAddress.postalCode,
    ship_country: shippingAddress.country,
    value_a: order._id.toString(),
    value_b: req.user._id.toString(),
    value_c: 'SSLCommerz',
  };

  const paymentResponse = await sslClient.init(paymentPayload);

  if (!paymentResponse?.GatewayPageURL) {
    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: 'Failed',
      orderStatus: 'Cancelled',
    });
    res.status(500);
    throw new Error('Unable to initialize SSLCommerz payment session');
  }

  res.status(201).json({
    url: paymentResponse.GatewayPageURL,
    orderId: order._id,
  });
});

const createCodOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (!validateShippingAddress(shippingAddress)) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const order = await createOrderFromCart({
    userId: req.user._id,
    cart,
    shippingAddress,
    paymentMethod: 'COD',
  });

  await clearCart(req.user._id);

  res.status(201).json(order);
});

const paymentSuccess = asyncHandler(async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const { val_id: valId, tran_id: transactionId, value_a: orderId } = payload;

  const order = await Order.findOne({
    $or: [{ _id: orderId }, { transactionId }],
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found for callback');
  }

  const sslClient = getSslClient();

  let isVerified = false;

  if (valId) {
    const validationResponse = await sslClient.validate({ val_id: valId });
    const normalized = Array.isArray(validationResponse)
      ? validationResponse[0]
      : validationResponse;
    const status = String(normalized?.status || '').toUpperCase();

    if (status === 'VALID' || status === 'VALIDATED' || normalized?.val_id || normalized?.tran_id) {
      isVerified = true;
      order.sslValidationId = normalized?.val_id || valId;
    }
  }

  if (!isVerified) {
    order.paymentStatus = 'Failed';
    order.orderStatus = 'Cancelled';
    await order.save();
    res.redirect(`${process.env.CLIENT_URL}/order-confirmation?order_id=${order._id}&payment=failed`);
    return;
  }

  order.paymentStatus = 'Paid';
  order.orderStatus = 'Processing';
  await order.save();

  await clearCart(order.user);

  res.redirect(`${process.env.CLIENT_URL}/order-confirmation?order_id=${order._id}&payment=success`);
});

const paymentFail = asyncHandler(async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const { tran_id: transactionId, value_a: orderId } = payload;

  const order = await Order.findOne({
    $or: [{ _id: orderId }, { transactionId }],
  });

  if (order) {
    order.paymentStatus = 'Failed';
    order.orderStatus = 'Cancelled';
    await order.save();
  }

  res.redirect(`${process.env.CLIENT_URL}/order-confirmation?order_id=${order?._id || ''}&payment=failed`);
});

const paymentCancel = asyncHandler(async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const { tran_id: transactionId, value_a: orderId } = payload;

  const order = await Order.findOne({
    $or: [{ _id: orderId }, { transactionId }],
  });

  if (order) {
    order.paymentStatus = 'Failed';
    order.orderStatus = 'Cancelled';
    await order.save();
  }

  res.redirect(`${process.env.CLIENT_URL}/order-confirmation?order_id=${order?._id || ''}&payment=cancelled`);
});

const paymentIpn = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'IPN received' });
});

export { initPayment, createCodOrder, paymentSuccess, paymentFail, paymentCancel, paymentIpn };
