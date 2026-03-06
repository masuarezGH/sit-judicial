import { pool } from "../db/pool.js";

export async function resumen(req, res) {
  try {
    const [[abiertos]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM tickets
       WHERE estado IN ('Abierto', 'En Proceso')`
    );

    const [[cerrados]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM tickets
       WHERE estado = 'Cerrado'`
    );

    const [[altaPrioridad]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM tickets
       WHERE prioridad = 'Alta'
       AND estado IN ('Abierto', 'En Proceso')`
    );

    const [[contratosUrgentes]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM contratos
       WHERE fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       AND estado = 'Vigente'`
    );

    res.json({
      ticketsAbiertos: abiertos.total,
      ticketsCerrados: cerrados.total,
      ticketsAltaPrioridad: altaPrioridad.total,
      contratosUrgentes: contratosUrgentes.total
    });
  } catch (error) {
    console.error("Error al obtener resumen del dashboard:", error);
    res.status(500).json({ error: "Error interno al obtener resumen del dashboard" });
  }
}

export async function ticketsPorPrioridad(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT prioridad, COUNT(*) AS total
       FROM tickets
       GROUP BY prioridad
       ORDER BY total DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener tickets por prioridad:", error);
    res.status(500).json({ error: "Error interno al obtener tickets por prioridad" });
  }
}

export async function ticketsPorEstado(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT estado, COUNT(*) AS total
       FROM tickets
       GROUP BY estado
       ORDER BY total DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener tickets por estado:", error);
    res.status(500).json({ error: "Error interno al obtener tickets por estado" });
  }
}

export async function contratosUrgentes(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT *
       FROM contratos
       WHERE fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       AND estado = 'Vigente'
       ORDER BY fecha_fin ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener contratos urgentes:", error);
    res.status(500).json({ error: "Error interno al obtener contratos urgentes" });
  }
}

  export async function ticketsRecientes(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.asunto, t.prioridad, t.estado, t.fecha_creacion,
              a.id AS activo_id,
              u.nombre AS tecnico_nombre
       FROM tickets t
       LEFT JOIN activos a ON t.activo_id = a.id
       LEFT JOIN usuarios u ON t.tecnico_asignado = u.id
       ORDER BY t.fecha_creacion DESC
       LIMIT 10`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener tickets recientes:", error);
    res.status(500).json({ error: "Error interno al obtener tickets recientes" });
  }
}
