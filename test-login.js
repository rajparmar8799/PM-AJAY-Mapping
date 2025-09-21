// Simple test script to verify login functionality
const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login functionality...\n');
    
    const testCredentials = [
      { role: 'central_ministry', username: 'ministry_admin', password: 'central123' },
      { role: 'state_admin', username: 'maharashtra_admin', password: 'state123' },
      { role: 'village_committee', username: 'village_head1', password: 'village123' },
      { role: 'implementing_agency', username: 'infra_agency1', password: 'agency123' }
    ];

    for (const creds of testCredentials) {
      try {
        console.log(`Testing ${creds.role} login...`);
        const response = await axios.post('http://localhost:5000/api/auth/login', creds);
        console.log(`✅ ${creds.role}: Login successful - ${response.data.user.name}`);
      } catch (error) {
        console.log(`❌ ${creds.role}: Login failed - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Backend server not running or accessible');
    console.log('Please make sure the backend server is running on port 5000');
  }
}

testLogin();