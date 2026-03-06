import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  baja
} from "../controllers/activos.controller.js";

const router = Router();

router.use(authJwt);

router.get("/", requireRoles("ADMIN", "OPERADOR"), listar);
router.get("/:id", requireRoles("ADMIN", "OPERADOR"), obtenerPorId);
router.post("/", requireRoles("ADMIN", "OPERADOR"), crear);
router.put("/:id", requireRoles("ADMIN", "OPERADOR"), actualizar);
router.put("/:id/baja", requireRoles("ADMIN", "OPERADOR"), baja);

export default router;