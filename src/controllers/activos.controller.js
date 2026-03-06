import { pool } from "../db/pool.js";

export async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM activos ORDER BY fecha_creacion DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar activos:", error);
    res.status(500).json({ error: "Error interno al listar activos" });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM activos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Activo no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener activo:", error);
    res.status(500).json({ error: "Error interno al obtener activo" });
  }
}

export async function crear(req, res) {
  try {
    const {
      id,
      tipo,
      marca,
      modelo,
      numero_serie,
      juzgado,
      puesto_trabajo,
      estado,
      contrato_id
    } = req.body;

    if (!id || !tipo || !marca || !modelo) {
      return res.status(400).json({
        error: "Los campos id, tipo, marca y modelo son obligatorios"
      });
    }

    await pool.query(
      `INSERT INTO activos 
      (id, tipo, marca, modelo, numero_serie, juzgado, puesto_trabajo, estado, contrato_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      
      [
        id,
        tipo,
        marca,
        modelo,
        numero_serie || null,
        juzgado || null,
        puesto_trabajo || null,
        estado || "Operativo",
        contrato_id || null
      ]
      
    );
    await pool.query(
      "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
      [id, "Activo registrado en el sistema"]
    );
  
    res.status(201).json({ ok: true, mensaje: "Activo creado correctamente" });
  } catch (error) {
    console.error("Error al crear activo:", error);
    res.status(500).json({ error: "Error interno al crear activo" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      tipo,
      marca,
      modelo,
      numero_serie,
      juzgado,
      puesto_trabajo,
      estado,
      contrato_id
    } = req.body;

    const [resultado] = await pool.query(
      `UPDATE activos
       SET tipo = ?, marca = ?, modelo = ?, numero_serie = ?, juzgado = ?, puesto_trabajo = ?, estado = ?, contrato_id = ?
       WHERE id = ?`,
      [
        tipo,
        marca,
        modelo,
        numero_serie || null,
        juzgado || null,
        puesto_trabajo || null,
        estado,
        contrato_id || null,
        id
      ]
    );
    await pool.query(
      "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
      [id, "Activo actualizado"]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Activo no encontrado" });
    }

    res.json({ ok: true, mensaje: "Activo actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar activo:", error);
    res.status(500).json({ error: "Error interno al actualizar activo" });
  }
}

export async function baja(req, res) {
  try {
    const { id } = req.params;

    const [activoRows] = await pool.query(
      "SELECT * FROM activos WHERE id = ?",
      [id]
    );

    if (activoRows.length === 0) {
      return res.status(404).json({ error: "Activo no encontrado" });
    }

    const [ticketsAbiertos] = await pool.query(
      `SELECT id, estado
       FROM tickets
       WHERE activo_id = ?
       AND estado IN ('Abierto', 'En Proceso')`,
      [id]
    );

    if (ticketsAbiertos.length > 0) {
      return res.status(400).json({
        error: "No se puede dar de baja el activo porque tiene tickets abiertos o en proceso"
      });
    }

    const [resultado] = await pool.query(
      "UPDATE activos SET estado = 'Dado de Baja' WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Activo no encontrado" });
    }

    await pool.query(
      "INSERT INTO historial_activo (activo_id, evento) VALUES (?, ?)",
      [id, "Activo dado de baja"]
    );

    res.json({ ok: true, mensaje: "Activo dado de baja correctamente" });
  } catch (error) {
    console.error("Error al dar de baja activo:", error);
    res.status(500).json({ error: "Error interno al dar de baja activo" });
  }
}

