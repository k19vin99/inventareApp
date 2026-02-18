const express = require('express');
const router = express.Router();
const pool = require('./db');
const { hashPassword } = require('./utils/hashPassword');

// --- Helpers de saneo/validación ---
const toNull = (v) => (v === '' || v === undefined ? null : v);
const toLowerOrNull = (v) => (v === '' || v === undefined ? null : String(v).toLowerCase());
const isUuid = (str) => /^[0-9a-fA-F-]{36}$/.test(String(str || ''));

// GET /api/users  -> lista con datos de empresa
router.get('/users', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        u.rut, u.email, u.first_name, u.middle_name, u.last_name, u.second_last_name,
        u.gender, u.position, u.birth_date, u.hire_date, u.address, u.created_at,
        u.company_id,
        c.company_code, c.name AS company_name
      FROM users u
      LEFT JOIN companies c ON c.id = u.company_id
      ORDER BY u.created_at DESC
      LIMIT 500
    `);
    res.json(rows);
  } catch (err) {
    console.error('[USERS] list error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// GET /api/users/:rut  -> obtener un usuario (para edición)
router.get('/users/:rut', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        u.rut, u.email, u.first_name, u.middle_name, u.last_name, u.second_last_name,
        u.gender, u.position, u.birth_date, u.hire_date, u.address, u.company_id,
        c.company_code, c.name AS company_name
      FROM users u
      LEFT JOIN companies c ON c.id = u.company_id
      WHERE u.rut = $1
      LIMIT 1
    `, [req.params.rut]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[USERS] get error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// POST /api/users  -> crear usuario (incluye company_id)
router.post('/users', async (req, res) => {
  try {
    const {
      rut, email, password, first_name, last_name,
      middle_name, second_last_name, gender, position,
      birth_date, hire_date, address, company_id
    } = req.body || {};

    if (!rut || !email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'rut, email, password, first_name, last_name are required' });
    }

    const password_hash = await hashPassword(password);

    // Saneo
    const vals = [
      rut,
      String(email).toLowerCase(),
      password_hash,
      first_name,
      toNull(middle_name),
      last_name,
      toNull(second_last_name),
      toNull(gender),         // NULL evita violar el CHECK si viene ''
      toNull(position),
      toNull(birth_date),     // '' -> NULL (DATE)
      toNull(hire_date),      // '' -> NULL (DATE)
      toNull(address),
      toNull(company_id)
    ];

    // Validación opcional de company_id cuando viene no-nulo
    if (vals[12] && !isUuid(vals[12])) {
      return res.status(400).json({ error: 'invalid company_id' });
    }

    const q = `
      INSERT INTO users
      (rut, email, password_hash, first_name, middle_name, last_name, second_last_name,
       gender, position, birth_date, hire_date, address, company_id)
      VALUES
      ($1, LOWER($2), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING rut, email, first_name, last_name, company_id, created_at
    `;
    const { rows } = await pool.query(q, vals);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'rut or email already exists' });
    if (err.code === '23503') return res.status(400).json({ error: 'invalid company_id' });
    if (err.code === '22007') return res.status(400).json({ error: 'invalid date' });
    if (err.code === '22P02') return res.status(400).json({ error: 'invalid input syntax' });
    if (err.code === '23514') return res.status(400).json({ error: 'check constraint violation' });
    console.error('[USERS] create error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// PUT /api/users/:rut  -> editar usuario (opcional password)
router.put('/users/:rut', async (req, res) => {
  try {
    const {
      email, password, first_name, middle_name, last_name, second_last_name,
      gender, position, birth_date, hire_date, address, company_id
    } = req.body || {};

    // Saneo ('' -> NULL). En email mantenemos string si llega.
    const patch = {
      email: email !== undefined ? String(email).toLowerCase() : undefined,
      first_name,
      middle_name: toNull(middle_name),
      last_name,
      second_last_name: toNull(second_last_name),
      gender: toNull(gender),          // NULL evita violar el CHECK si viene ''
      position: toNull(position),
      birth_date: toNull(birth_date),  // '' -> NULL (DATE)
      hire_date: toNull(hire_date),    // '' -> NULL (DATE)
      address: toNull(address),
      company_id: toNull(company_id)
    };

    if (patch.company_id && !isUuid(patch.company_id)) {
      return res.status(400).json({ error: 'invalid company_id' });
    }

    let setParts = [];
    let vals = [];
    let idx = 1;

    const pushSet = (col, val) => {
      vals.push(val);
      setParts.push(`${col} = $${idx++}`);
    };

    Object.entries(patch).forEach(([key, val]) => {
      if (val !== undefined) pushSet(key, val);
    });

    if (password !== undefined && password !== '') {
      const password_hash = await hashPassword(password);
      pushSet('password_hash', password_hash);
    }

    if (!setParts.length) {
      return res.status(400).json({ error: 'no fields to update' });
    }

    // WHERE por RUT (texto)
    vals.push(req.params.rut);
    const sql = `
      UPDATE users SET ${setParts.join(', ')}
      WHERE rut = $${idx}
      RETURNING rut, email, first_name, last_name, company_id, updated_at
    `;
    const { rows } = await pool.query(sql, vals);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'email already exists' });
    if (err.code === '23503') return res.status(400).json({ error: 'invalid company_id' });
    if (err.code === '22007') return res.status(400).json({ error: 'invalid date' });
    if (err.code === '22P02') return res.status(400).json({ error: 'invalid input syntax' });
    if (err.code === '23514') return res.status(400).json({ error: 'check constraint violation' });
    console.error('[USERS] update error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// DELETE /api/users/:rut  -> eliminar (hard delete)
router.delete('/users/:rut', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE rut = $1', [req.params.rut]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[USERS] delete error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;