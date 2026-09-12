const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexora_fallback_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
