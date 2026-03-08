# Sistema de Gestión de Soporte Técnico - SIT Judicial

API REST desarrollada en **Node.js + Express + MySQL** para la gestión de activos informáticos, tickets de soporte y contratos de mantenimiento en el ámbito judicial.

El sistema permite registrar activos, gestionar tickets de soporte técnico, administrar contratos y visualizar métricas operativas mediante un dashboard.

---

# Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- JWT (autenticación)
- bcrypt (hash de contraseñas)
- Docker
- Postman
- Thunder Client (VSCode)
- MySQL2

---

# Arquitectura del proyecto

El backend sigue una **arquitectura en capas (Layered Architecture)** para separar responsabilidades y facilitar el mantenimiento del sistema.

```
SITJUDICIAL
├── src
│ ├── controllers/
│ ├── db/
│ ├── middlewares/
│ ├── routes/
│ ├── services/
│ └── app.js
│
├── postman/
│   └── SIT Judicial API.postman_collection.json
│
└── tests/
│   └── casos_prueba_backend_sit_judicial.xlsx
│
├── database.sql
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── .dockerignore
```

### Descripción de capas

**Controllers**  
Contienen la lógica principal de los endpoints y gestionan las solicitudes HTTP.

**Routes**  
Definen los endpoints de la API y conectan cada ruta con su controlador correspondiente.

**Services**  
Encapsulan la lógica de acceso a datos y consultas a la base de datos.

**Middlewares**  
Funciones intermedias utilizadas para autenticación, autorización y validación.

**DB**  
Contiene la configuración de conexión a MySQL mediante `mysql2`.

**app.js**  
Es el punto de entrada de la aplicación donde se inicializa Express, se registran rutas y se inicia el servidor.

---

# Flujo de una solicitud en la API

El flujo de una petición HTTP sigue el siguiente recorrido:

```
Cliente → Route → Middleware → Controller → Service → Base de datos
```
Ejemplo:

```
POST /api/tickets
```
1. El cliente envía la solicitud.
2. La ruta dirige la petición al controlador correspondiente.
3. Los middlewares verifican autenticación y permisos.
4. El controller procesa la lógica de negocio.
5. El service ejecuta consultas SQL.
6. Se devuelve la respuesta al cliente.

---

# Funcionalidades principales

### Gestión de usuarios

- Crear usuarios
- Actualizar usuarios
- Desactivar usuarios
- Listar usuarios

### Gestión de activos

- Registrar activos informáticos
- Actualizar activos
- Dar de baja activos
- Consultar historial de activos

### Gestión de tickets

- Crear tickets de soporte
- Asignar técnicos
- Actualizar tickets
- Cerrar tickets
- Anular tickets

### Gestión de contratos

- Crear contratos de mantenimiento
- Actualizar contratos
- Eliminar contratos
- Validación de activos asociados

### Dashboard

- Tickets abiertos
- Tickets cerrados
- Tickets de alta prioridad
- Contratos próximos a vencer
- Tickets por prioridad
- Tickets por estado

---

# Autenticación

La API utiliza **JWT (JSON Web Token)** para autenticación.

Flujo:

1. El usuario realiza login.
2. El servidor devuelve un **token JWT**.
3. El token se envía en cada request mediante:

```
Authorization: Bearer TOKEN
```

### Roles soportados

- **ADMIN**
- **OPERADOR**
- **TECNICO**

Cada rol posee permisos específicos sobre los endpoints.

---

# Ejecución del proyecto

## Requisitos

- Docker
- Docker Compose

---

# Ejecutar con Docker

Desde la raíz del proyecto:
```
docker compose down -v
docker compose up --build
```
La API quedará disponible en:

```
http://localhost:8080
```

---

# Verificar funcionamiento

Endpoint de salud del sistema:

```
GET /health
```
Respuesta esperada:

```
{
"ok": true
}
```

---

# Base de datos

La base de datos se inicializa automáticamente mediante el archivo:

```
database.sql
```
Incluye:

- estructura de tablas
- datos de prueba
- usuarios para autenticación

---

# Usuarios de prueba

| Rol | Email | Password |
|-----|------|------|
| ADMIN | admin@pj.gov.ar | admin123 |
| OPERADOR | marcelo@pj.gov.ar | operador123 |
| TECNICO | jperez@pj.gov.ar | tecnico123 |

---

# Colección Postman

El proyecto incluye una colección Postman para probar todos los endpoints:

```
SIT Judicial API.postman_collection.json
```

Flujo recomendado:

1. Ejecutar **Login Admin**
2. Se genera automáticamente el token
3. Probar los demás endpoints

---

# Casos de prueba

Se incluyen casos de prueba funcionales del backend en:

```
casos_prueba_backend_sit_judicial.xlsx
```

Los casos cubren:

- autenticación
- gestión de usuarios
- gestión de activos
- gestión de tickets
- gestión de contratos
- dashboard
- historial

---

# Endpoints principales

| Método | Endpoint | Descripción |
|------|------|------|
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/usuarios | Listar usuarios |
| POST | /api/usuarios | Crear usuario |
| GET | /api/activos | Listar activos |
| POST | /api/activos | Crear activo |
| GET | /api/tickets | Listar tickets |
| POST | /api/tickets | Crear ticket |
| PUT | /api/tickets/{id}/cerrar | Cerrar ticket |
| GET | /api/dashboard/resumen | KPIs del sistema |

---

# Seguridad

- Autenticación mediante JWT
- Control de acceso basado en roles (RBAC)
- Hash de contraseñas con bcrypt
- Validación de datos en endpoints críticos

---

# Autor

Proyecto desarrollado como trabajo práctico para la materia **Práctica Profesionalizante I**  
Tecnicatura Superior en Desarrollo de Software  
Instituto de Estudios Superiores de Santa Fe

Autor: **Marcos Suarez**

---
