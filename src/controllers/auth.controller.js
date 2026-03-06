import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { findUserByEmail } from "../services/user.service.js";
dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Faltan credenciales" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
  if (!user.activo) return res.status(403).json({ error: "Usuario inactivo" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );

  res.json({ token });
}