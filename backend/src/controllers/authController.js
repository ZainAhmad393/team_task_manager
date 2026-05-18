const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES = '7d'

const sendToken = (res, user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword
      },
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    })

    sendToken(res, user)
    return res.status(201).json({ message: 'Account created successfully', user })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    }
    sendToken(res, safeUser)
    return res.status(200).json({ message: 'Logged in successfully', user: safeUser })
  } catch (error) {
    next(error)
  }
}

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  return res.status(200).json({ message: 'Logged out successfully' })
}

const getMe = (req, res) => {
  return res.status(200).json({ user: req.user })
}

module.exports = { register, login, logout, getMe }