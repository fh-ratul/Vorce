import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getProducts = asyncHandler(async (req, res) => {
  const { category, size, minPrice, maxPrice, search } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (size) {
    query.sizes = size;
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  const categories = await Product.distinct('category');
  const sizes = await Product.distinct('sizes');

  res.json({ products, filters: { categories, sizes } });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ $or: [{ featured: true }, { badge: { $ne: null } }] })
    .sort({ createdAt: -1 })
    .limit(4);

  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

export { getProducts, getFeaturedProducts, getProductById };
