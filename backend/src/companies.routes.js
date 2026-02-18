const express = require('express');
const router = express.Router();
const pool = require('./db');

// Helper simple para validar formato UUID v4/v1 (36 chars con guiones)
function isUuid(str) {
  return /^[0-9a-fA-F-]{36}$/.test(String(str || ''));
}

// GET /api/companies?search=&status=active
router.get('/companies', async (req, res) => {
  try {
    const { search = '', status } = req.query;
    const terms = [];
    const where = [];

    if (search) {
      terms.push(`%${String(search).toLowerCase()}%`);
      // Reutilizamos el mismo placeholder ($1) en todas las columnas del OR (válido en Postgres)
      const idx = terms.length;
      where.push(`(
        LOWER(company_code) LIKE $${idx}
        OR LOWER(name)       LIKE $${idx}
        OR LOWER(legal_name) LIKE $${idx}
        OR LOWER(rut)        LIKE $${idx}
      )`);
    }

    if (status) {
      const s = String(status).toLowerCase();
      if (!['active', 'inactive'].includes(s)) {
        return res.status(400).json({ error: "invalid status (use 'active'|'inactive')" });
      }
      terms.push(s);
      where.push(`status = $${terms.length}`);
    }

    const sql = `
      SELECT id, company_code, rut, name, legal_name, industry, address, phone, email, status, created_at
      FROM companies
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY created_at DESC
      LIMIT 500
    `;
    const { rows } = await pool.query(sql, terms);
    res.json(rows);
  } catch (err) {
    console.error('[COMPANIES] list error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// POST /api/companies
router.post('/companies', async (req, res) => {
  try {
    const {
      company_code, rut, name, legal_name,
      industry, address, phone, email
    } = req.body || {};

    if (!company_code || !rut || !name || !legal_name) {
      return res.status(400).json({ error: 'company_code, rut, name, legal_name are required' });
    }

    const insert = `
      INSERT INTO companies (company_code, rut, name, legal_name, industry, address, phone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, LOWER($8))
      RETURNING id, company_code, rut, name, legal_name, industry, address, phone, email, status, created_at
    `;
    const { rows } = await pool.query(insert, [
      String(company_code).trim(),
      String(rut).trim(),
      String(name).trim(),
      String(legal_name).trim(),
      industry || null,
      address || null,
      phone || null,
      email || null
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'company_code or rut already exists' });
    }
    console.error('[COMPANIES] create error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// GET /api/companies/:id
router.get('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'invalid company id' });
    }

    const { rows } = await pool.query(
      `SELECT id, company_code, rut, name, legal_name, industry, address, phone, email, status, created_at, updated_at
       FROM companies WHERE id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[COMPANIES] get error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// PUT /api/companies/:id
router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'invalid company id' });
    }

    const {
      company_code, rut, name, legal_name,
      industry, address, phone, email, status
    } = req.body || {};

    if (status && !['active', 'inactive'].includes(String(status))) {
      return res.status(400).json({ error: "invalid status (use 'active'|'inactive')" });
    }

    const { rows } = await pool.query(
      `UPDATE companies SET
        company_code = COALESCE($2, company_code),
        rut          = COALESCE($3, rut),
        name         = COALESCE($4, name),
        legal_name   = COALESCE($5, legal_name),
        industry     = COALESCE($6, industry),
        address      = COALESCE($7, address),
        phone        = COALESCE($8, phone),
        email        = COALESCE(LOWER($9), email),
        status       = COALESCE($10, status)
       WHERE id = $1
       RETURNING id, company_code, rut, name, legal_name, industry, address, phone, email, status, updated_at`,
      [
        id,
        company_code ?? null,
        rut ?? null,
        name ?? null,
        legal_name ?? null,
        industry ?? null,
        address ?? null,
        phone ?? null,
        email ?? null,
        status ?? null
      ]
    );

    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'company_code or rut already exists' });
    }
    console.error('[COMPANIES] update error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// DELETE (soft) /api/companies/:id
router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'invalid company id' });
    }

    const { rows } = await pool.query(
      `UPDATE companies
         SET status = 'inactive'
       WHERE id = $1 AND status <> 'inactive'
       RETURNING id, status`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found or already inactive' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[COMPANIES] delete error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;