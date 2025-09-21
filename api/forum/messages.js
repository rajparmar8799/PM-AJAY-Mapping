const { authenticateToken } = require('../_middleware');

// Mock forum messages data
let mockMessages = [
  {
    id: 1,
    user_id: 'ia001',
    user_name: 'Bharat Infrastructure Pvt Ltd',
    project_id: 'PROJ001',
    message: 'Rural Road Construction Phase 1 update: We have successfully completed 75% of the road construction work. Currently working on the final stretch connecting villages 12-15.',
    timestamp: '2024-09-20T10:30:00Z',
    type: 'update'
  },
  {
    id: 2,
    user_id: 'ia002',
    user_name: 'Skill Development Institute',
    project_id: 'PROJ004',
    message: 'Digital Literacy Training Program: We are pleased to report that 240 out of 300 rural youth have completed the basic digital literacy modules. The response has been excellent.',
    timestamp: '2024-09-19T14:15:00Z',
    type: 'update'
  },
  {
    id: 3,
    user_id: 'cm001',
    user_name: 'Central Ministry Administrator',
    project_id: null,
    message: 'All implementing agencies are requested to submit their monthly progress reports by the end of this week.',
    timestamp: '2024-09-18T09:00:00Z',
    type: 'general'
  }
];

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Return mock messages sorted by timestamp (newest first)
      const messages = mockMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      res.json(messages);
    } catch (error) {
      console.error('Get forum messages error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const user = authenticateToken(req);
      const { message, project_id } = req.body;
      const userId = user.id;
      const userName = user.name;

      if (!message) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      // Create new message
      const newMessage = {
        id: Date.now(),
        user_id: userId,
        user_name: userName,
        project_id: project_id || null,
        message: message,
        timestamp: new Date().toISOString(),
        type: 'update'
      };

      // Add to mock data
      mockMessages.push(newMessage);

      res.json({ message: 'Message posted successfully', data: newMessage });
    } catch (error) {
      console.error('Post forum message error:', error);
      if (error.message === 'Access token required' || error.message === 'Invalid token') {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}