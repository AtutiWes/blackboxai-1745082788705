const express = require('express');
const { Op } = require('sequelize');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const project = await Project.create({ name, description, userId });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// Get all projects for the logged-in user with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      userId,
      name: {
        [Op.iLike]: `%${search}%`
      }
    };

    const { rows: projects, count } = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      projects,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// Get a single project by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const project = await Project.findOne({
      where: { id: req.params.id, userId }
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    const project = await Project.findOne({ where: { id: req.params.id, userId } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const project = await Project.findOne({ where: { id: req.params.id, userId } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

module.exports = router;
