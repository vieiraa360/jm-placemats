import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('🔍 Testing Email Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'not set (default: smtp.gmail.com)');
console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || 'not set (default: 587)');
console.log('  EMAIL_SECURE:', process.env.EMAIL_SECURE || 'not set (default: false)');
console.log('  EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : '❌ NOT SET');
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || process.env.EMAIL_USER || 'not set');
console.log('  EMAIL_TO:', process.env.EMAIL_TO || process.env.EMAIL_USER || 'not set');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('❌ Email credentials are missing!');
  console.log('   Please set EMAIL_USER and EMAIL_PASS in your .env file');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

console.log('Testing SMTP connection...\n');

// Test connection
try {
  await transporter.verify();
  console.log('✅ SMTP connection successful!\n');
} catch (error) {
  console.log('❌ SMTP connection failed!\n');
  console.log('Error Details:');
  console.log('  Code:', error.code);
  console.log('  Command:', error.command);
  console.log('  Message:', error.message);
  if (error.response) {
    console.log('  Response:', error.response);
  }
  if (error.responseCode) {
    console.log('  Response Code:', error.responseCode);
  }
  console.log('\nCommon Issues:');
  console.log('  1. Wrong password - Make sure you\'re using an App Password for Gmail');
  console.log('  2. 2FA not enabled - Gmail requires 2FA to generate App Passwords');
  console.log('  3. "Less secure app access" - This is deprecated, use App Passwords instead');
  console.log('  4. Wrong SMTP settings - Check EMAIL_HOST and EMAIL_PORT');
  
  // Check for specific Gmail error
  if (error.responseCode === 534 || error.message.includes('web browser')) {
    console.log('\n🔴 GMAIL WEB LOGIN REQUIRED:');
    console.log('   This error means Gmail requires you to log in via web browser first.');
    console.log('   Steps to fix:');
    console.log('   1. Go to https://mail.google.com and log in with:', process.env.EMAIL_USER);
    console.log('   2. Complete any security checks Google asks for');
    console.log('   3. Go to https://myaccount.google.com/apppasswords');
    console.log('   4. Generate a NEW App Password');
    console.log('   5. Update EMAIL_PASS in .env with the new password');
    console.log('   6. Restart your backend server');
    console.log('   7. Run this test again');
    console.log('\n   See GMAIL_WEBLOGIN_FIX.md for detailed instructions');
  }
  
  process.exit(1);
}

// Test sending email
console.log('Testing email send...\n');

const testEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;
const mailOptions = {
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  to: testEmail,
  subject: 'Test Email from JM Placemats Backend',
  text: 'This is a test email to verify the email configuration is working correctly.',
  html: '<p>This is a test email to verify the email configuration is working correctly.</p>'
};

try {
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Test email sent successfully!');
  console.log('  Message ID:', info.messageId);
  console.log('  Response:', info.response);
  console.log('\n📧 Check your inbox (and spam folder) at:', testEmail);
} catch (error) {
  console.log('❌ Failed to send test email!\n');
  console.log('Error Details:');
  console.log('  Code:', error.code);
  console.log('  Command:', error.command);
  console.log('  Message:', error.message);
  if (error.response) {
    console.log('  Response:', error.response);
  }
  if (error.responseCode) {
    console.log('  Response Code:', error.responseCode);
  }
  process.exit(1);
}

process.exit(0);
