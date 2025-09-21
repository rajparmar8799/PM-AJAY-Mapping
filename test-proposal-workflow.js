// Test script to create a proposal from State Admin and test the complete workflow
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testProposalWorkflow() {
  console.log('🚀 Starting Proposal Workflow Test...\n');

  try {
    // Step 1: Login as Maharashtra State Admin
    console.log('Step 1: Logging in as Maharashtra State Admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'maharashtra_admin',
      password: 'demo123',
      role: 'state_admin'
    });
    
    const stateAdminToken = loginResponse.data.token;
    console.log('✅ State Admin logged in successfully\n');

    // Step 2: Submit a new proposal
    console.log('Step 2: Submitting new proposal...');
    const proposalData = {
      title: 'Modern Library & Digital Hub',
      description: 'Establishment of a modern library with digital learning facilities, computer lab, and internet connectivity for rural students and communities.',
      project_type: 'Education',
      estimated_budget: 4500000,
      timeline: '8 months',
      district: 'Satara',
      village: 'Wai'
    };

    const proposalResponse = await axios.post(`${API_BASE}/state/proposals`, proposalData, {
      headers: { Authorization: `Bearer ${stateAdminToken}` }
    });
    
    const newProposal = proposalResponse.data.data;
    console.log('✅ New proposal submitted:', newProposal.title);
    console.log('   Proposal ID:', newProposal.id);
    console.log('   Status:', newProposal.status);
    console.log('   Budget: ₹', new Intl.NumberFormat('en-IN').format(newProposal.estimated_budget), '\n');

    // Step 3: Login as Central Ministry to assign proposal
    console.log('Step 3: Logging in as Central Ministry...');
    const ministryLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'ministry_admin',
      password: 'demo123',
      role: 'central_ministry'
    });
    
    const ministryToken = ministryLogin.data.token;
    console.log('✅ Central Ministry logged in successfully\n');

    // Step 4: Assign proposal to an agency
    console.log('Step 4: Assigning proposal to Skill Development Institute...');
    const assignResponse = await axios.put(`${API_BASE}/proposals/${newProposal.id}/assign`, {
      agency_id: 'ia002'
    }, {
      headers: { Authorization: `Bearer ${ministryToken}` }
    });
    
    const assignedProposal = assignResponse.data.proposal;
    console.log('✅ Proposal assigned to:', assignedProposal.assigned_agency_name);
    console.log('   Status:', assignedProposal.status, '\n');

    // Step 5: Login as Agency to review and accept proposal
    console.log('Step 5: Logging in as Skill Development Agency...');
    const agencyLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'skill_agency1',
      password: 'demo123',
      role: 'implementing_agency'
    });
    
    const agencyToken = agencyLogin.data.token;
    console.log('✅ Agency logged in successfully\n');

    // Step 6: Get proposals assigned to agency
    console.log('Step 6: Checking proposals assigned to agency...');
    const agencyProposals = await axios.get(`${API_BASE}/proposals`, {
      headers: { Authorization: `Bearer ${agencyToken}` }
    });
    
    console.log('✅ Agency can see', agencyProposals.data.length, 'proposals');
    const ourProposal = agencyProposals.data.find(p => p.id === newProposal.id);
    if (ourProposal) {
      console.log('   - Found our new proposal:', ourProposal.title);
      console.log('   - Status:', ourProposal.status, '\n');
    }

    console.log('🎉 Proposal workflow test completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Login as: skill_agency1 / demo123');
    console.log('3. Go to "Assigned Proposals" tab');
    console.log('4. Click "Review Proposal" or "Accept & Start Planning"');
    console.log('5. Test the complete workflow!\n');

  } catch (error) {
    console.error('❌ Error in workflow test:', error.response?.data || error.message);
  }
}

// Run the test
testProposalWorkflow();