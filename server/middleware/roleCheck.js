const roleCheck = (requiredRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles || [];
    const hasRole = userRoles.some(role => requiredRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = roleCheck;
