// Quick test script for the contact API
const testContactAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the API test script'
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

testContactAPI();

