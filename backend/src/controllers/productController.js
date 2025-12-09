import Product from '../models/Product.js';

/**
 * Get all products
 */
export const getProducts = async (req, res) => {
  try {
    const { category, featured, in_stock } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (in_stock !== undefined) {
      query.in_stock = in_stock === 'true';
    }

    const products = await Product.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get a single product by ID
 */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid product data'
    });
  }
};

/**
 * Update a product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid product data'
    });
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
