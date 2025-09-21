const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);

    // Return user data from JWT token (already authenticated)
    const { iat, exp, ...userProfile } = user; // Remove JWT timestamps
    res.json(userProfile);
  } catch (error) {
    console.error('Profile error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}