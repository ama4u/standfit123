// Simple test script to verify News Flash API
const http = require('http');

function testAPI(port) {
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/api/newsflash',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
      try {
        const parsed = JSON.parse(data);
        console.log('News Flash Items:', parsed.length);
        if (parsed.length > 0) {
          console.log('Sample item:', parsed[0]);
        }
      } catch (e) {
        console.log('Could not parse JSON response');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

// Test both common ports
console.log('Testing port 5000...');
testAPI(5000);

setTimeout(() => {
  console.log('\nTesting port 5001...');
  testAPI(5001);
}, 2000);