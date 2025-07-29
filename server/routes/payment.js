import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post('/create-order', authMiddleware, async (req, res) => {
  const amount = 49900; // ₹499 in paise

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
});



import crypto from 'crypto';
import UserModel from '../model/usermodel.js';

// POST /api/payment/verify
router.post('/verify', authMiddleware, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const user = await UserModel.findById(req.user.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Update user with subscription details
  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + 1); // 1-month plan

  const subscription = {
    planId: 'pro499',
    status: 'active',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    paymentMethod: 'razorpay',
    startDate: now,
    endDate: expiry,
    lastBillingDate: now,
    nextBillingDate: expiry
  };

  user.isSubscribed = true;
  user.subscriptionPlan = 'pro';
  user.subscriptionExpiry = expiry;
  user.subscription = subscription;
  user.subscriptionHistory.push(subscription);
  await user.save();

  res.json({ success: true, message: 'Subscription activated' });
});
