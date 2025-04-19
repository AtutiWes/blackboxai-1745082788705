const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Role;
