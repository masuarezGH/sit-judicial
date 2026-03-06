import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authJwt(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.sendStatus(401);

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, rol }
    next();
  } catch {
    return res.sendStatus(401);
  }
}