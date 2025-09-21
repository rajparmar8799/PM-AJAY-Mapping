// Debug script to test proposal API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function debugProposalAPI() {
  console.log('🔍 Debugging Proposal API Endpoints...\n');

  try {
    // Step 1: Login as Agency
    console.log('Step 1: Logging in as Skill Development Agency...');
    const agencyLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'skill_agency1',
      password: 'demo123',
      role: 'implementing_agency'
    });
    
    const agencyToken = agencyLogin.data.token;
    console.log('✅ Agency logged in successfully');
    console.log('   User ID:', agencyLogin.data.user.id);
    console.log('   User Role:', agencyLogin.data.user.role, '\n');

    // Step 2: Get proposals assigned to agency
    console.log('Step 2: Getting proposals assigned to agency...');
    const agencyProposals = await axios.get(`${API_BASE}/proposals`, {
      headers: { Authorization: `Bearer ${agencyToken}` }
    });
    
    console.log('✅ Found', agencyProposals.data.length, 'proposals');
    
    // Find an assigned proposal
    const assignedProposal = agencyProposals.data.find(p => p.assigned_agency === agencyLogin.data.user.id && p.status === 'Assigned');
    
    if (!assignedProposal) {
      console.log('❌ No assigned proposals found with "Assigned" status');
      console.log('Available proposals:');
      agencyProposals.data.forEach(p => {
        console.log(`   - ID: ${p.id}, Title: ${p.title}, Status: ${p.status}, Assigned Agency: ${p.assigned_agency}`);
      });
      return;
    }
    
    console.log('✅ Found assigned proposal:', assignedProposal.title);
    console.log('   Proposal ID:', assignedProposal.id);
    console.log('   Status:', assignedProposal.status);
    console.log('   Assigned Agency:', assignedProposal.assigned_agency, '\n');

    // Step 3: Test Review API
    console.log('Step 3: Testing proposal review API...');
    try {
      const reviewResponse = await axios.put(`${API_BASE}/proposals/${assignedProposal.id}/review`, {
        status: 'Under Review',
        review_comments: 'This is a test review comment from debug script.'
      }, {
        headers: { Authorization: `Bearer ${agencyToken}` }
      });
      
      console.log('✅ Review API successful:', reviewResponse.data.message);
      console.log('   Updated Status:', reviewResponse.data.proposal.status, '\n');
      
    } catch (reviewError) {
      console.log('❌ Review API Error:');
      console.log('   Status:', reviewError.response?.status);
      console.log('   Error:', reviewError.response?.data);
      console.log('   Full Error:', reviewError.message, '\n');
    }

    // Step 4: Test Accept API (only if review worked)
    console.log('Step 4: Testing proposal accept API...');
    try {
      const acceptResponse = await axios.put(`${API_BASE}/proposals/${assignedProposal.id}/accept`, {
        start_date: '2024-02-01',
        expected_completion: '2024-10-01',
        implementation_plan: 'This is a test implementation plan from debug script.'
      }, {
        headers: { Authorization: `Bearer ${agencyToken}` }
      });
      
      console.log('✅ Accept API successful:', acceptResponse.data.message);
      console.log('   Project Created:', acceptResponse.data.project?.id, '\n');
      
    } catch (acceptError) {
      console.log('❌ Accept API Error:');
      console.log('   Status:', acceptError.response?.status);
      console.log('   Error:', acceptError.response?.data);
      console.log('   Full Error:', acceptError.message, '\n');
    }

  } catch (error) {
    console.error('❌ General Error:', error.response?.data || error.message);
  }
}

// Run the debug
debugProposalAPI();