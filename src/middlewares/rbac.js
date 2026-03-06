export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if (!roles.includes(req.user.rol)) return res.sendStatus(403);
  next();
};