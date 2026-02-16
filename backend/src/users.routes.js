const express = require('express');
const router = express.Router();
const pool = require('./db');

// GET /api/users  -> lista básica de usuarios (sin password_hash)
router.get('/users', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        rut,
        email,
        first_name,
        middle_name,
        last_name,
        second_last_name,
        gender,
        position,
        birth_date,
        hire_date,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 200
    `);
    res.json(rows);
  } catch (err) {
    console.error('[USERS] list error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;