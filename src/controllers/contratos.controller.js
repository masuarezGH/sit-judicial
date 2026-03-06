import { pool } from "../db/pool.js";

export async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contratos ORDER BY fecha_creacion DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar contratos:", error);
    res.status(500).json({ error: "Error interno al listar contratos" });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM contratos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener contrato:", error);
    res.status(500).json({ error: "Error interno al obtener contrato" });
  }
}

export async function crear(req, res) {
  try {
    const {
      id,
      proveedor,
      tipo,
      fecha_inicio,
      fecha_fin,
      estado
    } = req.body;

    if (!id || !proveedor || !tipo || !fecha_inicio || !fecha_fin || !estado) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios"
      });
    }

    await pool.query(
      `INSERT INTO contratos
      (id, proveedor, tipo, fecha_inicio, fecha_fin, estado)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id, proveedor, tipo, fecha_inicio, fecha_fin, estado]
    );

    res.status(201).json({ ok: true, mensaje: "Contrato creado correctamente" });
  } catch (error) {
    console.error("Error al crear contrato:", error);
    res.status(500).json({ error: "Error interno al crear contrato" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      proveedor,
      tipo,
      fecha_inicio,
      fecha_fin,
      estado
    } = req.body;

    const [resultado] = await pool.query(
      `UPDATE contratos
       SET proveedor = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
       WHERE id = ?`,
      [proveedor, tipo, fecha_inicio, fecha_fin, estado, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.json({ ok: true, mensaje: "Contrato actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar contrato:", error);
    res.status(500).json({ error: "Error interno al actualizar contrato" });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;

    const [contratoRows] = await pool.query(
      "SELECT * FROM contratos WHERE id = ?",
      [id]
    );

    if (contratoRows.length === 0) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    const [activosAsociados] = await pool.query(
      "SELECT id, tipo, marca, modelo FROM activos WHERE contrato_id = ?",
      [id]
    );

    if (activosAsociados.length > 0) {
      return res.status(400).json({
        error: "No se puede eliminar el contrato porque tiene activos asociados"
      });
    }

    const [resultado] = await pool.query(
      "DELETE FROM contratos WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.json({ ok: true, mensaje: "Contrato eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar contrato:", error);
    res.status(500).json({ error: "Error interno al eliminar contrato" });
  }
}
