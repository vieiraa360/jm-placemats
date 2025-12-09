import express from 'express';
import { body, validationResult } from 'express-validator';
import { createCheckoutSession, handleWebhook, verifySession } from '../controllers/stripeController.js';

const router = express.Router();

// Webhook endpoint - raw body is handled in server.js before this router
router.post('/webhook', handleWebhook);

// Validation rules for checkout
const checkoutValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items array is required and must not be empty'),
  body('items.*.product_id')
    .notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Customer email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('Shipping address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Create checkout session
router.post('/create-checkout-session', checkoutValidation, handleValidationErrors, createCheckoutSession);

// Verify session (for success page)
router.get('/verify-session', verifySession);

export default router;
