const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

// Associations
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });

module.exports = Project;
