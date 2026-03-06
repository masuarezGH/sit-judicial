import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
} from "../controllers/contratos.controller.js";

const router = Router();

router.use(authJwt);
router.use(requireRoles("ADMIN", "OPERADOR"));

router.get("/", listar);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;