import jwt from 'jsonwebtoken';

const auth = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format invalid' });
  }

  // Verify token
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.user; // decoded.user now contains id, role, name, email
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;