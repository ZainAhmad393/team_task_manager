const express = require('express')
const router = express.Router()
const { register, login, logout, getMe } = require('../controllers/authController')
const { isAuthenticated } = require('../middleware/auth')
const { registerValidator, loginValidator } = require('../middleware/validators')
const { authLimiter } = require('../middleware/rateLimiter')

router.post('/register', authLimiter, registerValidator, register)
router.post('/login',    authLimiter, loginValidator,    login)
router.post('/logout',   isAuthenticated,                logout)
router.get('/me',        isAuthenticated,                getMe)

module.exports = router