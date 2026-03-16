import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
} from '../controllers/adminController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);
router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
