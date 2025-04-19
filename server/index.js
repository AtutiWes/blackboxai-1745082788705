const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const Role = require('./models/Role');
const User = require('./models/User');
const UserRole = require('./models/UserRole');
const Project = require('./models/Project');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SaaS backend API' });
});

// Sync models and initialize roles, then start server
const initializeRoles = async () => {
  const roles = ['admin', 'user'];
  for (const roleName of roles) {
    await Role.findOrCreate({ where: { name: roleName } });
  }
};

connectDB().then(async () => {
  await sequelize.sync({ alter: true });
  await initializeRoles();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});
