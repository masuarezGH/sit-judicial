import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";

export async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error interno al listar usuarios" });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno al obtener usuario" });
  }
}

export async function crear(req, res) {
  try {
    const { nombre, email, password, rol, activo } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        error: "Los campos nombre, email, password y rol son obligatorios"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, hash, rol, activo ?? true]
    );

    res.status(201).json({ ok: true, mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno al crear usuario" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo } = req.body;

    const [resultado] = await pool.query(
      `UPDATE usuarios
       SET nombre = ?, email = ?, rol = ?, activo = ?
       WHERE id = ?`,
      [nombre, email, rol, activo, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ ok: true, mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno al actualizar usuario" });
  }
}

export async function desactivar(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      "UPDATE usuarios SET activo = false WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ ok: true, mensaje: "Usuario desactivado correctamente" });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ error: "Error interno al desactivar usuario" });
  }
}