const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ error: 'Not authenticated' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    })
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

// backward compat alias
const isAuthenticated = authenticate

module.exports = { authenticate, isAuthenticated }