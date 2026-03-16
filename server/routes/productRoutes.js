import express from 'express';
import { getFeaturedProducts, getProductById, getProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
