const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ej: postgres://user:pass@localhost:5432/inventareapp
  // ssl: { rejectUnauthorized: false } // habilitar si usas un servicio gestionado con SSL
});

module.exports = pool;