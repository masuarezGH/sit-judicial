import { pool } from "../db/pool.js";

export async function obtenerHistorialActivo(req, res) {
  try {
    const { id } = req.params;

    const [activos] = await pool.query(
      "SELECT * FROM activos WHERE id = ?",
      [id]
    );

    if (activos.length === 0) {
      return res.status(404).json({ error: "Activo no encontrado" });
    }

    const activo = activos[0];

    const [historial] = await pool.query(
      `SELECT * 
       FROM historial_activo
       WHERE activo_id = ?
       ORDER BY fecha_evento DESC`,
      [id]
    );

    const [tickets] = await pool.query(
      `SELECT t.*, u.nombre AS tecnico_nombre
       FROM tickets t
       LEFT JOIN usuarios u ON t.tecnico_asignado = u.id
       WHERE t.activo_id = ?
       ORDER BY t.fecha_creacion DESC`,
      [id]
    );

    res.json({
      activo,
      historial,
      tickets
    });
  } catch (error) {
    console.error("Error al obtener historial del activo:", error);
    res.status(500).json({ error: "Error interno al obtener historial del activo" });
  }
}