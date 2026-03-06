import { pool } from "../db/pool.js";

export async function listar(req, res) {
  try {
    let sql = `
      SELECT t.*, u.nombre AS tecnico_nombre
      FROM tickets t
      LEFT JOIN usuarios u ON t.tecnico_asignado = u.id
    `;
    let params = [];

    if (req.user.rol === "TECNICO") {
      sql += " WHERE t.tecnico_asignado = ? ";
      params.push(req.user.id);
    }

    sql += " ORDER BY t.fecha_creacion DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Error al listar tickets:", error);
    res.status(500).json({ error: "Error interno al listar tickets" });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    let sql = `
      SELECT t.*, u.nombre AS tecnico_nombre
      FROM tickets t
      LEFT JOIN usuarios u ON t.tecnico_asignado = u.id
      WHERE t.id = ?
    `;
    let params = [id];

    if (req.user.rol === "TECNICO") {
      sql += " AND t.tecnico_asignado = ? ";
      params.push(req.user.id);
    }

    const [rows] = await pool.query(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error interno al obtener ticket" });
  }
}

export async function crear(req, res) {
  try {
    const {
      id,
      activo_id,
      asunto,
      descripcion,
      prioridad,
      estado,
      tecnico_asignado
    } = req.body;

    if (!id || !activo_id || !asunto) {
      return res.status(400).json({
        error: "Los campos id, activo_id y asunto son obligatorios"
      });
    }

    await pool.query(
      `INSERT INTO tickets
      (id, activo_id, asunto, descripcion, prioridad, estado, tecnico_asignado)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        activo_id,
        asunto,
        descripcion || null,
        prioridad || "Media",
        estado || "Abierto",
        tecnico_asignado || null
      ]
    );
    await pool.query(
    "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
    [activo_id, `Ticket ${id} creado: ${asunto}`]
    );

    res.status(201).json({ ok: true, mensaje: "Ticket creado correctamente" });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ error: "Error interno al crear ticket" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      asunto,
      descripcion,
      prioridad,
      estado,
      tecnico_asignado
    } = req.body;

    let verificarSql = "SELECT * FROM tickets WHERE id = ?";
    let verificarParams = [id];

    if (req.user.rol === "TECNICO") {
      verificarSql += " AND tecnico_asignado = ?";
      verificarParams.push(req.user.id);
    }

    const [tickets] = await pool.query(verificarSql, verificarParams);

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado o sin permiso" });
    }

    const [resultado] = await pool.query(
      `UPDATE tickets
       SET asunto = ?, descripcion = ?, prioridad = ?, estado = ?, tecnico_asignado = ?
       WHERE id = ?`,
      [
        asunto,
        descripcion || null,
        prioridad,
        estado,
        tecnico_asignado || null,
        id
      ]
    );
    await pool.query(
    "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
    [tickets[0].activo_id, `Ticket ${id} actualizado`]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ ok: true, mensaje: "Ticket actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar ticket:", error);
    res.status(500).json({ error: "Error interno al actualizar ticket" });
  }
}

export async function cerrar(req, res) {
  try {
    const { id } = req.params;

    let verificarSql = "SELECT * FROM tickets WHERE id = ?";
    let verificarParams = [id];

    if (req.user.rol === "TECNICO") {
      verificarSql += " AND tecnico_asignado = ?";
      verificarParams.push(req.user.id);
    }

    const [tickets] = await pool.query(verificarSql, verificarParams);

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado o sin permiso" });
    }

    const [resultado] = await pool.query(
      `UPDATE tickets
       SET estado = 'Cerrado', fecha_cierre = NOW()
       WHERE id = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const [ticketRows] = await pool.query(
      "SELECT activo_id FROM tickets WHERE id = ?",
      [id]
    );

    if (ticketRows.length > 0) {
      await pool.query(
        "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
        [ticketRows[0].activo_id, `Ticket ${id} cerrado`]
      );
    }

    res.json({ ok: true, mensaje: "Ticket cerrado correctamente" });
  } catch (error) {
    console.error("Error al cerrar ticket:", error);
    res.status(500).json({ error: "Error interno al cerrar ticket" });
  }
}

export async function anular(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      "DELETE FROM tickets WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ ok: true, mensaje: "Ticket anulado correctamente" });
  } catch (error) {
    console.error("Error al anular ticket:", error);
    res.status(500).json({ error: "Error interno al anular ticket" });
  }
}