import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

console.log('🔍 Checking .env file...\n');

// Try to read .env file directly
try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  
  console.log('✅ .env file found at:', envPath);
  console.log('\n📋 Environment Variables Status:\n');
  
  const requiredVars = [
    'MONGODB_URI',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_FROM',
    'EMAIL_TO',
    'STRIPE_SECRET_KEY',
    'FRONTEND_URL'
  ];
  
  const envLines = envContent.split('\n');
  const foundVars = {};
  
  envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key] = trimmed.split('=');
      if (key) {
        foundVars[key.trim()] = true;
      }
    }
  });
  
  requiredVars.forEach(varName => {
    const isSet = process.env[varName] || foundVars[varName];
    const value = process.env[varName];
    
    if (isSet) {
      if (varName.includes('PASS') || varName.includes('SECRET') || varName.includes('KEY')) {
        console.log(`  ✅ ${varName}: Set (${value ? value.length : 'found'} chars)`);
      } else {
        console.log(`  ✅ ${varName}: ${value || 'found in file'}`);
      }
    } else {
      console.log(`  ❌ ${varName}: NOT SET`);
    }
  });
  
  console.log('\n📝 Checking for common issues:\n');
  
  // Check for common mistakes
  if (process.env.EMAIL_PASS) {
    const pass = process.env.EMAIL_PASS;
    if (pass.includes(' ')) {
      console.log('  ⚠️  EMAIL_PASS contains spaces - App Passwords should not have spaces');
    }
    if (pass.length < 10) {
      console.log('  ⚠️  EMAIL_PASS seems too short - Gmail App Passwords are 16 characters');
    }
  }
  
  if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('@')) {
    console.log('  ⚠️  EMAIL_USER does not look like an email address');
  }
  
  if (process.env.EMAIL_HOST === 'smtp.gmail.com' && process.env.EMAIL_PORT !== '587') {
    console.log('  ⚠️  Gmail typically uses port 587 (not 465 for non-secure)');
  }
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('❌ .env file not found!');
    console.log('   Create a .env file in the backend directory');
  } else {
    console.log('❌ Error reading .env file:', error.message);
  }
}

console.log('\n💡 Tip: After updating .env, restart the server (Ctrl+C then npm run dev)');
