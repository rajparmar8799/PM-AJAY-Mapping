const { dbGet } = require('../_db');
const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);

    const userData = await dbGet('SELECT * FROM users WHERE id = ?', [user.id]);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = userData;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}