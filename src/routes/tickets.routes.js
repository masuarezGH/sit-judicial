import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  cerrar,
  anular
} from "../controllers/tickets.controller.js";

const router = Router();

router.use(authJwt);

router.get("/", requireRoles("ADMIN", "OPERADOR", "TECNICO"), listar);
router.get("/:id", requireRoles("ADMIN", "OPERADOR", "TECNICO"), obtenerPorId);
router.post("/", requireRoles("ADMIN", "OPERADOR"), crear);
router.put("/:id", requireRoles("ADMIN", "OPERADOR", "TECNICO"), actualizar);
router.put("/:id/cerrar", requireRoles("ADMIN", "TECNICO"), cerrar);
router.delete("/:id", requireRoles("ADMIN", "OPERADOR"), anular);

export default router;