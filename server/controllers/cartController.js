import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';

const calculateCartTotals = (cart) => ({
  ...cart.toObject(),
  itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
  subtotal: cart.items.reduce((total, item) => total + item.quantity * item.price, 0),
});

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    const newCart = await Cart.create({ user: req.user._id, items: [] });
    res.json(calculateCartTotals(newCart));
    return;
  }

  res.json(calculateCartTotals(cart));
});

const addCartItem = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  if (!productId || !size) {
    res.status(400);
    throw new Error('Product and size are required');
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!product.sizes.includes(size)) {
    res.status(400);
    throw new Error('Selected size is unavailable');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product._id.toString() && item.size === size
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      size,
      quantity,
    });
  }

  await cart.save();
  res.status(201).json(calculateCartTotals(cart));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, size } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (quantity) {
    item.quantity = Number(quantity);
  }

  if (size) {
    item.size = size;
  }

  cart.items = cart.items.filter((cartItem) => cartItem.quantity > 0);
  await cart.save();

  res.json(calculateCartTotals(cart));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  await cart.save();

  res.json(calculateCartTotals(cart));
});

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return null;
  }

  cart.items = [];
  await cart.save();
  return cart;
};

export { getUserCart, addCartItem, updateCartItem, removeCartItem, clearCart, calculateCartTotals };
