import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  image_url: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['placemat', 'coaster', 'set'],
    required: [true, 'Category is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  material: {
    type: String,
    trim: true,
    default: 'Handcrafted Beads'
  },
  in_stock: {
    type: Boolean,
    default: true
  },
  stripe_product_id: {
    type: String,
    trim: true,
    default: null
  },
  stripe_price_id: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ in_stock: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
