import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customer_email: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  shipping_address: {
    type: String,
    required: [true, 'Shipping address is required'],
    trim: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (items) => items.length > 0,
      message: 'Order must have at least one item'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  stripe_session_id: {
    type: String,
    trim: true,
    default: null
  },
  stripe_payment_intent_id: {
    type: String,
    trim: true,
    default: null
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
orderSchema.index({ customer_email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ stripe_session_id: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
