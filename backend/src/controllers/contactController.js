import ContactInquiry from '../models/ContactInquiry.js';
import { sendContactEmail, sendConfirmationEmail } from '../config/email.js';
import { validationResult } from 'express-validator';

export const createContactInquiry = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, message } = req.body;

    // Create contact inquiry in database
    const contactInquiry = new ContactInquiry({
      name,
      email,
      message
    });

    const savedInquiry = await contactInquiry.save();

    // Send email to business owner
    try {
      await sendContactEmail({ name, email, message });
      console.log('✅ Contact email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed, but inquiry saved:');
      console.error('   Error code:', emailError.code);
      console.error('   Error message:', emailError.message);
      if (emailError.response) {
        console.error('   SMTP Response:', emailError.response);
      }
      // Continue even if email fails - inquiry is saved
    }

    // Send confirmation email to customer (optional, non-blocking)
    try {
      await sendConfirmationEmail({ name, email });
      console.log('✅ Confirmation email sent successfully');
    } catch (confirmationError) {
      console.error('⚠️  Confirmation email failed (non-critical):');
      console.error('   Error:', confirmationError.message);
      // Don't fail the request if confirmation email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact inquiry submitted successfully',
      data: {
        id: savedInquiry._id,
        name: savedInquiry.name,
        email: savedInquiry.email,
        createdAt: savedInquiry.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact inquiry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getContactInquiries = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = status ? { status } : {};
    
    const inquiries = await ContactInquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await ContactInquiry.countDocuments(query);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact inquiries',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

