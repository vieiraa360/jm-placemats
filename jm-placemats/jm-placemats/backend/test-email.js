// Test email configuration
import dotenv from 'dotenv';
import { sendContactEmail } from './src/config/email.js';

dotenv.config();

console.log('Testing email configuration...');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
console.log('EMAIL_TO:', process.env.EMAIL_TO || 'Not set');
console.log('');

const testEmail = async () => {
  try {
    console.log('Attempting to send test email...');
    const result = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test email from the test script'
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Email failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }
};

testEmail();

