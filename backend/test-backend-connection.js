import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

console.log('🔍 Backend Connection Test\n');
console.log('Configuration:');
console.log(`  Backend Port: ${PORT}`);
console.log(`  Frontend URL: ${FRONTEND_URL}`);
console.log(`  Backend URL: http://localhost:${PORT}\n`);

// Test if backend is accessible
console.log('Testing backend connection...\n');

try {
  const response = await fetch(`http://localhost:${PORT}/health`);
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ Backend is running and accessible!');
    console.log('   Response:', data);
  } else {
    console.log('⚠️  Backend responded but with error status:', response.status);
  }
} catch (error) {
  console.log('❌ Cannot connect to backend!');
  console.log('   Error:', error.message);
  console.log('\n   Possible issues:');
  console.log('   1. Backend server is not running');
  console.log('   2. Backend is running on a different port');
  console.log('   3. Firewall is blocking the connection');
  console.log('\n   To fix:');
  console.log('   1. Make sure backend is running: cd backend && npm run dev');
  console.log(`   2. Check that backend is listening on port ${PORT}`);
  console.log('   3. Check browser console for CORS errors');
}

console.log('\n📋 CORS Configuration:');
console.log(`   Backend allows requests from: ${FRONTEND_URL}`);
console.log(`   Make sure your frontend is running on: ${FRONTEND_URL.replace('http://', '').split(':')[1] || '3001'}`);
