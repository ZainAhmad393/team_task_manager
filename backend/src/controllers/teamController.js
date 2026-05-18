const prisma = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

// Fields to select for team responses
const teamSelect = {
  id: true,
  name: true,
  description: true,
  color: true,
  createdAt: true,
  updatedAt: true,
  owner: { select: { id: true, name: true, email: true, avatar: true } },
  members: {
    select: {
      id: true,
      role: true,
      joinedAt: true,
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  },
  _count: { select: { tasks: true, members: true } },
};

/**
 * GET /teams
 * Get all teams the current user is a member of
 */
const getTeams = async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      select: teamSelect,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ teams });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teams
 * Create a new team
 */
const createTeam = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        description,
        color: color || '#6366f1',
        ownerId: req.user.id,
        // Auto-add creator as OWNER member
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER',
          },
        },
      },
      select: teamSelect,
    });

    res.status(201).json({ message: 'Team created', team });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /teams/:id
 * Get a specific team by ID
 */
const getTeam = async (req, res, next) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      select: {
        ...teamSelect,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            assignee: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!team) throw new ApiError('Team not found or access denied', 404);

    res.json({ team });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /teams/:id
 * Update team details
 */
const updateTeam = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    // Check ownership
    const team = await prisma.team.findFirst({
      where: { id: req.params.id },
      select: { ownerId: true },
    });

    if (!team) throw new ApiError('Team not found', 404);
    if (team.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Only the team owner can update this team', 403);
    }

    const updated = await prisma.team.update({
      where: { id: req.params.id },
      data: { name, description, color },
      select: teamSelect,
    });

    res.json({ message: 'Team updated', team: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /teams/:id
 * Delete a team
 */
const deleteTeam = async (req, res, next) => {
  try {
    const team = await prisma.team.findFirst({
      where: { id: req.params.id },
      select: { ownerId: true },
    });

    if (!team) throw new ApiError('Team not found', 404);
    if (team.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Only the team owner can delete this team', 403);
    }

    await prisma.team.delete({ where: { id: req.params.id } });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teams/:id/members
 * Add or remove a member from a team
 */
const manageMembers = async (req, res, next) => {
  try {
    const { email, role = 'MEMBER', action = 'add' } = req.body;
    const teamId = req.params.id;

    // Check if requester has permission (owner or admin member)
    const team = await prisma.team.findFirst({
      where: { id: teamId },
      select: {
        ownerId: true,
        members: { where: { userId: req.user.id }, select: { role: true } },
      },
    });

    if (!team) throw new ApiError('Team not found', 404);

    const requesterMember = team.members[0];
    const canManage =
      team.ownerId === req.user.id ||
      requesterMember?.role === 'OWNER' ||
      requesterMember?.role === 'ADMIN';

    if (!canManage) throw new ApiError('Insufficient permissions to manage members', 403);

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true, avatar: true },
    });

    if (!targetUser) throw new ApiError('User with this email not found', 404);
    if (targetUser.id === team.ownerId) throw new ApiError('Cannot modify team owner', 400);

    if (action === 'remove') {
      await prisma.teamMember.deleteMany({
        where: { teamId, userId: targetUser.id },
      });
      return res.json({ message: `${targetUser.name} removed from team` });
    }

    // Add member (upsert)
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId, userId: targetUser.id } },
      update: { role },
      create: { teamId, userId: targetUser.id, role },
    });

    const updatedTeam = await prisma.team.findUnique({
      where: { id: teamId },
      select: teamSelect,
    });

    res.json({ message: `${targetUser.name} added to team`, team: updatedTeam });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeams, createTeam, getTeam, updateTeam, deleteTeam, manageMembers };