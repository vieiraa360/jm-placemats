import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test email configuration
 */
export const testEmail = async (req, res) => {
  try {
    const { to, subject = 'Test Email from JM Placemats Backend' } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address (to) is required'
      });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email not configured',
        error: 'EMAIL_USER and EMAIL_PASS must be set in .env file'
      });
    }

    // Create transporter with same config as main email.js
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: false
    });

    // First verify connection
    try {
      await transporter.verify();
      console.log('✅ SMTP verification successful');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError.message);
      return res.status(500).json({
        success: false,
        message: 'SMTP connection failed',
        error: verifyError.message,
        code: verifyError.code,
        details: {
          command: verifyError.command,
          response: verifyError.response,
          responseCode: verifyError.responseCode
        },
        troubleshooting: {
          gmail: 'Make sure you\'re using an App Password (not regular password). Get one at: https://myaccount.google.com/apppasswords',
          checkCredentials: 'Verify EMAIL_USER and EMAIL_PASS in .env file',
          checkSettings: 'Verify EMAIL_HOST and EMAIL_PORT are correct'
        }
      });
    }

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9CAF88;">Test Email</h2>
          <p>This is a test email to verify the email configuration is working correctly.</p>
          <p>If you received this email, your email relay is configured properly!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent from JM Placemats Backend
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', to);

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      to: to,
      response: info.response
    });
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    
    let errorMessage = 'Failed to send test email';
    let errorDetails = {};

    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed';
      errorDetails = {
        issue: 'Invalid email credentials',
        solution: 'For Gmail: Use an App Password (not your regular password). Get one at: https://myaccount.google.com/apppasswords'
      };
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection failed';
      errorDetails = {
        issue: 'Cannot connect to SMTP server',
        solution: 'Check EMAIL_HOST and EMAIL_PORT settings. Verify your internet connection.'
      };
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      ...errorDetails
    });
  }
};
