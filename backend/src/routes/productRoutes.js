import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(['placemat', 'coaster', 'set']).withMessage('Category must be placemat, coaster, or set'),
  body('description').optional().trim(),
  body('image_url').optional().trim(),
  body('featured').optional().isBoolean(),
  body('material').optional().trim(),
  body('in_stock').optional().isBoolean()
];

// Routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', productValidation, createProduct);
router.put('/:id', productValidation, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
