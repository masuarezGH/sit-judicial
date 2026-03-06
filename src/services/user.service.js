import { pool } from "../db/pool.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}