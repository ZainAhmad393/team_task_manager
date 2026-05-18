require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');

const sessionConfig = require('./config/session');
const passport = require('./config/passport');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Allowed origins ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://team-task-manager-six-chi.vercel.app',   // ← your actual Vercel URL
  process.env.CLIENT_URL,                            // ← also set this in Render
].filter(Boolean)

// ─── Preflight handler (MUST be before everything else) ─────────────
app.options('*', (req, res) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie,X-Requested-With')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  res.sendStatus(204)
})

// ─── CORS middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
}))

// ─── Security ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// ─── Body parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ─── Logging ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ─── Rate limiting ───────────────────────────────────────────────────
app.use('/api/', generalLimiter)

// ─── Session + Passport ──────────────────────────────────────────────
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())

// ─── Health check ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/tasks', taskRoutes)

// ─── Error handling ──────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ─── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`   Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
})

module.exports = app