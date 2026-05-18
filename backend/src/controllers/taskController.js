const prisma = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  team: { select: { id: true, name: true, color: true } },
  assignee: { select: { id: true, name: true, email: true, avatar: true } },
  creator: { select: { id: true, name: true, avatar: true } },
  activities: {
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true,
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  },
};

/**
 * Helper: check if user has access to a team
 */
const checkTeamAccess = async (teamId, userId) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    select: { id: true, ownerId: true },
  });
  return team;
};

/**
 * GET /tasks
 * Get tasks with optional filters
 */
const getTasks = async (req, res, next) => {
  try {
    const { teamId, assigneeId, status, priority, search, page = 1, limit = 20 } = req.query;

    // Build where clause
    const where = {
      team: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
    };

    if (teamId) where.teamId = teamId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
          team: { select: { id: true, name: true, color: true } },
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
          creator: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /tasks
 * Create a new task
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, teamId, assigneeId, dueDate } = req.body;

    // Verify team access
    const team = await checkTeamAccess(teamId, req.user.id);
    if (!team) throw new ApiError('Team not found or access denied', 404);

    // Verify assignee is a team member (if provided)
    if (assigneeId) {
      const isMember = await prisma.teamMember.findFirst({
        where: { teamId, userId: assigneeId },
      });
      if (!isMember && assigneeId !== team.ownerId) {
        throw new ApiError('Assignee must be a team member', 400);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        teamId,
        assigneeId: assigneeId || null,
        creatorId: req.user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        activities: {
          create: {
            action: 'CREATED',
            details: `Task created by ${req.user.name}`,
            userId: req.user.id,
          },
        },
      },
      select: taskSelect,
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks/:id
 * Get a specific task
 */
const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        team: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { userId: req.user.id } } },
          ],
        },
      },
      select: taskSelect,
    });

    if (!task) throw new ApiError('Task not found or access denied', 404);

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /tasks/:id
 * Update a task
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assigneeId, dueDate } = req.body;

    // Verify task exists and user has access
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        team: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { userId: req.user.id } } },
          ],
        },
      },
      select: { id: true, status: true, title: true, teamId: true },
    });

    if (!existing) throw new ApiError('Task not found or access denied', 404);

    // Build activity log message
    const changes = [];
    if (status && status !== existing.status) changes.push(`status changed to ${status}`);
    if (title && title !== existing.title) changes.push(`title updated`);

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        activities: changes.length > 0 ? {
          create: {
            action: 'UPDATED',
            details: `${req.user.name} updated: ${changes.join(', ')}`,
            userId: req.user.id,
          },
        } : undefined,
      },
      select: taskSelect,
    });

    res.json({ message: 'Task updated', task });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /tasks/:id
 * Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        team: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { userId: req.user.id } } },
          ],
        },
      },
      select: { id: true, creatorId: true, team: { select: { ownerId: true } } },
    });

    if (!task) throw new ApiError('Task not found or access denied', 404);

    // Only creator or team owner can delete
    if (task.creatorId !== req.user.id && task.team.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError('Only the task creator or team owner can delete this task', 403);
    }

    await prisma.task.delete({ where: { id: req.params.id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks/stats
 * Get task statistics for the current user
 */
const getStats = async (req, res, next) => {
  try {
    const teamFilter = {
      team: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
    };

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count({ where: teamFilter }),
      prisma.task.count({ where: { ...teamFilter, status: 'PENDING' } }),
      prisma.task.count({ where: { ...teamFilter, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...teamFilter, status: 'COMPLETED' } }),
      prisma.task.count({
        where: {
          ...teamFilter,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
    ]);

    res.json({ stats: { total, pending, inProgress, completed, overdue } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask, getStats };