import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRoles } from "../middlewares/rbac.js";
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  desactivar
} from "../controllers/usuarios.controller.js";

const router = Router();

router.use(authJwt);
router.use(requireRoles("ADMIN"));

router.get("/", listar);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", desactivar);

export default router;