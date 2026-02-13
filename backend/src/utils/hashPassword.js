const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano usando bcrypt.
 * @param {string} plain - contraseña en texto plano
 * @returns {Promise<string>} hash resultante
 */
async function hashPassword(plain) {
  if (typeof plain !== 'string' || !plain) {
    throw new Error('password must be a non-empty string');
  }
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Verifica una contraseña en texto plano contra un hash.
 * @param {string} plain - contraseña en texto plano
 * @param {string} hash - hash bcrypt almacenado
 * @returns {Promise<boolean>} true si coincide
 */
async function verifyPassword(plain, hash) {
  if (typeof plain !== 'string' || !plain || typeof hash !== 'string' || !hash) {
    return false;
  }
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, verifyPassword };