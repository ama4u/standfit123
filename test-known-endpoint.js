import fetch from 'node-fetch';

async function testKnownEndpoint() {
  const baseUrl = 'https://standfit-e816d09b795a.herokuapp.com';
  
  console.log('Testing known admin endpoint...');
  
  try {
    // Test the admin orders endpoint which we know exists
    const response = await fetch(`${baseUrl}/api/admin/orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body (first 200 chars):', text.substring(0, 200));
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.log('Not JSON response');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testKnownEndpoint();