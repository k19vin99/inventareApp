const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) return res.status(401).json({ error: 'missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // opcional: { rut, email, first_name, last_name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = { requireAuth };