const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const sessionConfig = {
  store: new pgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  },
  name: 'ttm.sid',
};

module.exports = sessionConfig;