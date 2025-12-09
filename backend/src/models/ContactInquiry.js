import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Index for faster queries
contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ status: 1 });

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);

export default ContactInquiry;

