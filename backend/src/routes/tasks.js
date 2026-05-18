const express = require('express')
const router = express.Router()
const {
  getTasks, createTask, getTask,
  updateTask, deleteTask, getStats
} = require('../controllers/taskController')
const { isAuthenticated } = require('../middleware/auth')
const { taskValidator, taskUpdateValidator } = require('../middleware/validators')

router.use(isAuthenticated)

router.get('/stats', getStats)
router.get('/',      getTasks)
router.post('/',     taskValidator,       createTask)
router.get('/:id',   getTask)
router.put('/:id',   taskUpdateValidator, updateTask)
router.delete('/:id', deleteTask)

module.exports = router