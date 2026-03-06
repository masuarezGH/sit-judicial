import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import {
  resumen,
  ticketsPorPrioridad,
  ticketsPorEstado,
  contratosUrgentes,
  ticketsRecientes
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authJwt);
router.use(requireRoles("ADMIN", "OPERADOR"));

router.get("/resumen", resumen);
router.get("/tickets-por-prioridad", ticketsPorPrioridad);
router.get("/tickets-por-estado", ticketsPorEstado);
router.get("/contratos-urgentes", contratosUrgentes);
router.get("/tickets-recientes", ticketsRecientes);

export default router;