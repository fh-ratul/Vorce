import express from 'express';
import { addCartItem, getUserCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getUserCart);
router.post('/items', addCartItem);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);

export default router;
