// Check if our new API routes are registered on the server
const axios = require('axios');

async function checkServerRoutes() {
  console.log('🔍 Checking server routes...\n');
  
  // Test existing health endpoint (should work)
  try {
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health endpoint working:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.message);
    return;
  }
  
  // Test proposals endpoint (should work)
  try {
    const proposalsResponse = await axios.get('http://localhost:5000/api/proposals');
    console.log('❌ Proposals endpoint needs auth (expected 401)');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Proposals endpoint exists (401 auth required)');
    } else {
      console.log('❌ Proposals endpoint error:', error.response?.status, error.response?.data?.message);
    }
  }
  
  // Test our new review endpoint (with dummy auth header)
  try {
    const reviewResponse = await axios.put('http://localhost:5000/api/proposals/1/review', {
      status: 'Under Review'
    }, {
      headers: { Authorization: 'Bearer dummy' }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Review endpoint exists (401 auth required)');
    } else if (error.response?.status === 404) {
      console.log('❌ Review endpoint NOT FOUND (route not registered)');
    } else {
      console.log('❌ Review endpoint error:', error.response?.status, error.response?.data?.message);
    }
  }
  
  // Test our new accept endpoint (with dummy auth header)
  try {
    const acceptResponse = await axios.put('http://localhost:5000/api/proposals/1/accept', {
      start_date: '2024-01-01'
    }, {
      headers: { Authorization: 'Bearer dummy' }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Accept endpoint exists (401 auth required)');
    } else if (error.response?.status === 404) {
      console.log('❌ Accept endpoint NOT FOUND (route not registered)');
    } else {
      console.log('❌ Accept endpoint error:', error.response?.status, error.response?.data?.message);
    }
  }
}

checkServerRoutes();