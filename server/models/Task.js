const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('todo', 'in-progress', 'done'),
    defaultValue: 'todo',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

// Associations
Task.belongsTo(User, { foreignKey: 'userId', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });

Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });

module.exports = Task;
