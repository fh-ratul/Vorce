import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const [orderCount, productCount, revenueAggregate] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]),
  ]);

  res.json({
    totalOrders: orderCount,
    totalRevenue: revenueAggregate[0]?.totalRevenue || 0,
    productCount,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    images: req.body.images || [],
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.paymentMethod && ['SSLCommerz', 'COD'].includes(req.query.paymentMethod)) {
    query.paymentMethod = req.query.paymentMethod;
  }

  const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.body.orderStatus) {
    order.orderStatus = req.body.orderStatus;
  }

  if (req.body.paymentStatus) {
    if (order.paymentMethod !== 'COD') {
      res.status(400);
      throw new Error('Manual payment status updates are only allowed for COD orders');
    }

    order.paymentStatus = req.body.paymentStatus;
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

export { getDashboardStats, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus };
