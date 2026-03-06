import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import activosRoutes from "./routes/activos.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import contratosRoutes from "./routes/contratos.routes.js";
import historialRoutes from "./routes/historial.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/activos", activosRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/contratos", contratosRoutes); 
app.use("/api/activos", historialRoutes);
app.use("/api/dashboard", dashboardRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API corriendo en http://localhost:${port}`));