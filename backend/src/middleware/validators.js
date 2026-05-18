const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/),
  validate,
];

const loginValidator = [
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
];

const teamValidator = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  validate,
];

const memberValidator = [
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('role').optional().isIn(['ADMIN', 'MEMBER']),
  validate,
];

const taskValidator = [
  body('title').trim().notEmpty().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('teamId').trim().notEmpty(),
  body('dueDate').optional().isISO8601(),
  validate,
];

const taskUpdateValidator = [
  body('title').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate').optional().isISO8601(),
  validate,
];

module.exports = { registerValidator, loginValidator, teamValidator, memberValidator, taskValidator, taskUpdateValidator };