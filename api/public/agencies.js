const { dbAll } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const agencies = await dbAll(`
      SELECT
        id, name, type, contact_person, email
      FROM agencies
      ORDER BY name
    `);

    res.json(agencies);
  } catch (error) {
    console.error('Public agencies error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}