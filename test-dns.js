// Quick DNS test script
async function testDNS() {
  console.log('Testing DNS resolution for api.jm-placemats.com...\n');
  
  try {
    const response = await fetch('https://api.jm-placemats.com/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! DNS is working!');
      console.log('Response:', data);
      console.log('\n🎉 Your backend is now accessible!');
      console.log('Try the checkout process - it should work now!');
    } else {
      console.log('⚠️  DNS resolves but backend returned error:', response.status);
    }
  } catch (error) {
    if (error.message.includes('ERR_NAME_NOT_RESOLVED') || error.message.includes('getaddrinfo')) {
      console.log('⏳ DNS not ready yet - still propagating');
      console.log('Wait 2-3 minutes and run this script again');
      console.log('\nOr test manually:');
      console.log('  curl https://api.jm-placemats.com/health');
    } else {
      console.log('❌ Error:', error.message);
      console.log('\nPossible issues:');
      console.log('  1. DNS still propagating (wait 2-5 minutes)');
      console.log('  2. Tunnel not running (check: cloudflared tunnel run jm-placemats-backend)');
      console.log('  3. Backend not running (check: npm run dev in backend folder)');
    }
  }
}

testDNS();
