// Simple API test
import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/newsflash',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
});

req.end();