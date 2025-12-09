import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration (non-blocking)
// Only verify if credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify(function (error, success) {
    if (error) {
      console.log('⚠️  Email configuration error:', error.message);
      console.log('   Email functionality will not work until configured properly.');
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('⚠️  Email credentials not configured. Email functionality disabled.');
  console.log('   Set EMAIL_USER and EMAIL_PASS in .env to enable email.');
}

export const sendContactEmail = async (contactData) => {
  const { name, email, message } = contactData;

  // Email to business owner
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `New Contact Inquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9CAF88;">New Contact Inquiry</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px;">${message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This email was sent from the JM Placemats contact form.</p>
      </div>
    `,
    text: `
      New Contact Inquiry
      
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (contactData) => {
  const { name, email } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting JM Placemats',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9CAF88;">Thank You, ${name}!</h2>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>If you have any urgent questions, please feel free to reach out directly.</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Best regards,<br>
          The JM Placemats Team
        </p>
      </div>
    `,
    text: `Thank you, ${name}! We've received your message and will get back to you within 24 hours.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    // Don't throw - confirmation email failure shouldn't fail the whole request
    return { success: false, error: error.message };
  }
};

export default transporter;

