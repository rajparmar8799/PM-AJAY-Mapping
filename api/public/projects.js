const { dbAll } = require('../_db');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projects = await dbAll(`
      SELECT
        id, name, description, type, state, district, village,
        budget_allocated, progress_percentage, status,
        start_date, expected_completion
      FROM projects
      ORDER BY created_at DESC
    `);

    res.json(projects);
  } catch (error) {
    console.error('Public projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}