import express from 'express';
import {
  createCodOrder,
  initPayment,
  paymentCancel,
  paymentFail,
  paymentIpn,
  paymentSuccess,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/init', protect, initPayment);
router.post('/cod', protect, createCodOrder);
router.all('/success', paymentSuccess);
router.all('/fail', paymentFail);
router.all('/cancel', paymentCancel);
router.all('/ipn', paymentIpn);

export default router;
