import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import { obtenerHistorialActivo } from "../controllers/historial.controller.js";

const router = Router();

router.use(authJwt);
router.get("/:id/historial", requireRoles("ADMIN", "OPERADOR"), obtenerHistorialActivo);

export default router;