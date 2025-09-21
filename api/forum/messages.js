const { dbAll } = require('../_db');
const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const messages = await dbAll('SELECT * FROM forum_messages ORDER BY timestamp DESC');
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

      const { dbRun } = require('../_db');
      const result = await dbRun(`
        INSERT INTO forum_messages (user_id, user_name, project_id, message, type)
        VALUES (?, ?, ?, ?, 'update')
      `, [userId, userName, project_id || null, message]);

      const newMessage = await require('../_db').dbGet('SELECT * FROM forum_messages WHERE id = ?', [result.id]);
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