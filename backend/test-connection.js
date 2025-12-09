import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('🔍 Testing JM Placemats Backend Configuration...\n');

// Test MongoDB
console.log('1. Testing MongoDB Connection...');
try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jm-placemats');
  console.log('   ✅ MongoDB: Connected successfully');
  await mongoose.connection.close();
} catch (error) {
  console.log('   ❌ MongoDB: Connection failed');
  console.log('   Error:', error.message);
}

// Test Stripe
console.log('\n2. Testing Stripe Configuration...');
if (process.env.STRIPE_SECRET_KEY) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Try to retrieve account info
    await stripe.account.retrieve();
    console.log('   ✅ Stripe: API key is valid');
  } catch (error) {
    console.log('   ❌ Stripe: API key is invalid or error occurred');
    console.log('   Error:', error.message);
  }
} else {
  console.log('   ⚠️  Stripe: STRIPE_SECRET_KEY not set in .env');
}

// Test Email
console.log('\n3. Testing Email Configuration...');
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.verify();
    console.log('   ✅ Email: SMTP server is ready');
  } catch (error) {
    console.log('   ❌ Email: SMTP configuration error');
    console.log('   Error:', error.message);
    if (error.code) {
      console.log('   Error Code:', error.code);
    }
  }
} else {
  console.log('   ⚠️  Email: EMAIL_USER or EMAIL_PASS not set in .env');
}

// Test Environment Variables
console.log('\n4. Checking Environment Variables...');
const requiredVars = {
  'MONGODB_URI': process.env.MONGODB_URI,
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'EMAIL_USER': process.env.EMAIL_USER,
  'EMAIL_PASS': process.env.EMAIL_PASS ? '***' : undefined,
  'FRONTEND_URL': process.env.FRONTEND_URL || 'http://localhost:3001 (default)',
};

for (const [key, value] of Object.entries(requiredVars)) {
  if (value) {
    console.log(`   ✅ ${key}: Set`);
  } else {
    console.log(`   ⚠️  ${key}: Not set`);
  }
}

console.log('\n✅ Diagnostic complete!');
console.log('\nNext steps:');
console.log('1. Fix any ❌ errors above');
console.log('2. Make sure backend is running: npm run dev');
console.log('3. Test API: curl http://localhost:3000/health');
console.log('4. Test email: POST to http://localhost:3000/api/test-email');

process.exit(0);
