// Test with fresh login to verify token issue
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function freshLoginTest() {
  console.log('🔄 Testing with fresh login...\n');

  try {
    // Step 1: Fresh login
    console.log('Step 1: Fresh login as agency...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'skill_agency1',
      password: 'demo123',
      role: 'implementing_agency'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('   Token received:', token?.substring(0, 20) + '...');
    
    // Step 2: Test review endpoint with fresh token
    console.log('\nStep 2: Testing review endpoint with fresh token...');
    try {
      const reviewResponse = await axios.put(`${API_BASE}/proposals/7/review`, {
        status: 'Under Review',
        review_comments: 'Fresh token test'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Review endpoint works with fresh token');
      console.log('   Response:', reviewResponse.data.message);
      
    } catch (reviewError) {
      console.log('❌ Review still fails:');
      console.log('   Status:', reviewError.response?.status);
      console.log('   Message:', reviewError.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

freshLoginTest();