const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ msg: 'there is no token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
  } catch (error) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
