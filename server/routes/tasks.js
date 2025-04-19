const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, dueDate, projectId } = req.body;
    const userId = req.user.id;
    const task = await Task.create({ title, description, status, dueDate, projectId, userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Get all tasks for the logged-in user with optional filtering by project
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query;
    const where = { userId };
    if (projectId) {
      where.projectId = projectId;
    }
    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Get a single task by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router;
