const bcrypt = require('bcryptjs');
const passport = require('passport');
const prisma = require('../config/database');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), password: hashedPassword },
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: 'Account created successfully', user });
    });
  } catch (error) { next(error); }
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      const safeUser = { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role, createdAt: user.createdAt };
      return res.status(200).json({ message: 'Logged in successfully', user: safeUser });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((sessionErr) => {
      if (sessionErr) return next(sessionErr);
      res.clearCookie('ttm.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

const getMe = (req, res) => res.status(200).json({ user: req.user });

module.exports = { register, login, logout, getMe };