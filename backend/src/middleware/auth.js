const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  return res.status(400).json({ error: 'Already logged in.' });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') return next();
  return res.status(403).json({ error: 'Forbidden. Admin access required.' });
};

module.exports = { isAuthenticated, isNotAuthenticated, isAdmin };