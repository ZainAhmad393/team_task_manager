const express = require('express');
const router = express.Router();
const { getTeams, createTeam, getTeam, updateTeam, deleteTeam, manageMembers } = require('../controllers/teamController');
const { isAuthenticated } = require('../middleware/auth');
const { teamValidator, memberValidator } = require('../middleware/validators');

router.use(isAuthenticated);

router.get('/',              getTeams);
router.post('/',             teamValidator,  createTeam);
router.get('/:id',           getTeam);
router.put('/:id',           teamValidator,  updateTeam);
router.delete('/:id',        deleteTeam);
router.post('/:id/members',  memberValidator, manageMembers);

module.exports = router;