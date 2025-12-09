import express from 'express';
import { body } from 'express-validator';
import { createContactInquiry, getContactInquiries } from '../controllers/contactController.js';

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Routes
router.post('/', contactValidation, createContactInquiry);
router.get('/', getContactInquiries);

export default router;

