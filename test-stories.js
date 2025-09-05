// Simple test to check if stories API endpoints work
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testStoriesEndpoints() {
  console.log('Testing stories functionality...');
  
  try {
    // Test main page (should contain stories)
    console.log('\n1. Testing main page...');
    const mainPage = await makeRequest('/');
    console.log(`Main page status: ${mainPage.statusCode}`);
    
    // Check if stories section exists in the HTML
    if (mainPage.data.includes('stories') || mainPage.data.includes('milestone') || mainPage.data.includes('achievement')) {
      console.log('✅ Stories content found on main page');
    } else {
      console.log('⚠️  No stories content detected on main page');
    }
    
    // Test admin login page
    console.log('\n2. Testing admin access...');
    const adminPage = await makeRequest('/admin');
    console.log(`Admin page status: ${adminPage.statusCode}`);
    
    if (adminPage.statusCode === 200) {
      console.log('✅ Admin page accessible');
    } else {
      console.log('⚠️  Admin page redirected or not accessible');
    }
    
    console.log('\n✅ Basic connectivity tests completed!');
    console.log('\nTo fully test stories creation, you need to:');
    console.log('1. Access http://localhost:3001/admin in your browser');
    console.log('2. Log in with admin credentials');
    console.log('3. Navigate to Stories section');
    console.log('4. Try creating new entries in each category');
    
  } catch (error) {
    console.error('❌ Error testing stories:', error.message);
  }
}

// Run the test
testStoriesEndpoints();