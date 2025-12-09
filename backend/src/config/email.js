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
      console.log('   Error code:', error.code);
      console.log('   Error command:', error.command);
      if (error.response) {
        console.log('   SMTP response:', error.response);
      }
      console.log('   Email functionality will not work until configured properly.');
      
      // Check for Gmail web login required error
      if (error.responseCode === 534 || error.message.includes('web browser')) {
        console.log('\n   🔴 GMAIL WEB LOGIN REQUIRED:');
        console.log('   Gmail requires you to log in via web browser first.');
        console.log('   Steps:');
        console.log('   1. Go to https://mail.google.com and log in');
        console.log('   2. Then generate a NEW App Password');
        console.log('   3. See GMAIL_WEBLOGIN_FIX.md for details');
      } else {
        console.log('\n   Common fixes:');
        console.log('   - For Gmail: Use App Password (not regular password)');
        console.log('   - Enable 2FA: https://myaccount.google.com/security');
        console.log('   - Get App Password: https://myaccount.google.com/apppasswords');
        console.log('   - Check EMAIL_HOST and EMAIL_PORT settings');
      }
    } else {
      console.log('✅ Email server is ready to send messages');
      console.log('   From:', process.env.EMAIL_FROM || process.env.EMAIL_USER);
      console.log('   To:', process.env.EMAIL_TO || process.env.EMAIL_USER);
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
    console.log('   To:', mailOptions.to);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('   Code:', error.code);
    console.error('   Command:', error.command);
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   SMTP Response:', error.response);
    }
    if (error.responseCode) {
      console.error('   Response Code:', error.responseCode);
    }
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('\n   🔐 Authentication failed!');
      console.error('   - Check EMAIL_USER and EMAIL_PASS in .env');
      console.error('   - For Gmail: Make sure you\'re using an App Password');
      console.error('   - Get App Password: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n   🌐 Connection failed!');
      console.error('   - Check EMAIL_HOST and EMAIL_PORT');
      console.error('   - Verify your internet connection');
      console.error('   - Check firewall settings');
    }
    
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
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending confirmation email:');
    console.error('   Code:', error.code);
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   SMTP Response:', error.response);
    }
    // Don't throw - confirmation email failure shouldn't fail the whole request
    return { success: false, error: error.message };
  }
};

export default transporter;

