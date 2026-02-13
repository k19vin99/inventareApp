const express = require('express');
const router = express.Router();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/login  { email, password }
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const emailLc = String(email).toLowerCase().trim();
    const { rows } = await pool.query(
      `SELECT rut, email, password_hash, first_name, last_name
       FROM users WHERE email = $1 LIMIT 1`,
      [emailLc]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const payload = {
      rut: user.rut,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: payload });
  } catch (err) {
    console.error('[AUTH] login error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;