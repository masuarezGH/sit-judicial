  -- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.44 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para sit_judicial
CREATE DATABASE IF NOT EXISTS `sit_judicial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sit_judicial`;

-- Volcando estructura para tabla sit_judicial.activos
CREATE TABLE IF NOT EXISTS `activos` (
  `id` varchar(50) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `juzgado` varchar(150) DEFAULT NULL,
  `puesto_trabajo` varchar(150) DEFAULT NULL,
  `estado` enum('Operativo','Falla','Dado de Baja') DEFAULT 'Operativo',
  `contrato_id` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_activo_contrato` (`contrato_id`),
  CONSTRAINT `fk_activo_contrato` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sit_judicial.activos: ~2 rows (aproximadamente)
INSERT INTO `activos` (`id`, `tipo`, `marca`, `modelo`, `numero_serie`, `juzgado`, `puesto_trabajo`, `estado`, `contrato_id`, `fecha_creacion`) VALUES
	('INV-00124', 'PC Escritorio', 'Dell', 'Optiplex 3080', 'SN123456', 'Civil 1', 'Mesa 3', 'Operativo', NULL, '2026-03-06 10:38:46'),
	('INV-00125', 'PC Escritorio', 'Dell', 'Optiplex 3080', 'SN123456', 'Civil 1', 'Mesa 3', 'Operativo', NULL, '2026-03-06 12:24:42');

-- Volcando estructura para tabla sit_judicial.contratos
CREATE TABLE IF NOT EXISTS `contratos` (
  `id` varchar(50) NOT NULL,
  `proveedor` varchar(150) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Vigente','Vencido') NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sit_judicial.contratos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sit_judicial.historial_activo
CREATE TABLE IF NOT EXISTS `historial_activo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activo_id` varchar(50) NOT NULL,
  `evento` varchar(255) NOT NULL,
  `fecha_evento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_historial_activo` (`activo_id`),
  CONSTRAINT `fk_historial_activo` FOREIGN KEY (`activo_id`) REFERENCES `activos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sit_judicial.historial_activo: ~4 rows (aproximadamente)
INSERT INTO `historial_activo` (`id`, `activo_id`, `evento`, `fecha_evento`) VALUES
	(1, 'INV-00124', 'Activo dado de baja', '2026-03-06 12:20:35'),
	(2, 'INV-00124', 'Activo actualizado', '2026-03-06 12:24:16'),
	(3, 'INV-00125', 'Activo registrado en el sistema', '2026-03-06 12:24:42'),
	(4, 'INV-00124', 'Ticket TK-0001 actualizado', '2026-03-06 18:45:45');

-- Volcando estructura para tabla sit_judicial.tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` varchar(50) NOT NULL,
  `activo_id` varchar(50) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text,
  `prioridad` enum('Baja','Media','Alta') DEFAULT 'Media',
  `estado` enum('Abierto','En Proceso','Cerrado') DEFAULT 'Abierto',
  `tecnico_asignado` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_cierre` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ticket_activo` (`activo_id`),
  KEY `fk_ticket_tecnico` (`tecnico_asignado`),
  CONSTRAINT `fk_ticket_activo` FOREIGN KEY (`activo_id`) REFERENCES `activos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_tecnico` FOREIGN KEY (`tecnico_asignado`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sit_judicial.tickets: ~3 rows (aproximadamente)
INSERT INTO `tickets` (`id`, `activo_id`, `asunto`, `descripcion`, `prioridad`, `estado`, `tecnico_asignado`, `fecha_creacion`, `fecha_cierre`) VALUES
	('TK-0001', 'INV-00124', 'Error de encendido actualizado', 'Se reviso cableado y fuente', 'Media', 'En Proceso', 2, '2026-03-06 11:08:06', NULL),
	('TK-0002', 'INV-00124', 'Error de funcion', 'El equipo no pasa del logo al iniciar', 'Alta', 'Abierto', NULL, '2026-03-06 10:48:47', NULL),
	('TK-0003', 'INV-00124', 'Error de funcion', 'El equipo no pasa del logo al iniciar', 'Alta', 'Abierto', 2, '2026-03-06 11:11:00', NULL);

-- Volcando estructura para tabla sit_judicial.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','OPERADOR','TECNICO') NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sit_judicial.usuarios: ~4 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `activo`, `fecha_creacion`) VALUES
	(1, 'Administrador', 'admin@pj.gov.ar', '$2b$10$8AtxyJGoCm1ZeLm1RD31PutcDnQh7BsPgBu3LX9zS/yd0nbKpDtQa', 'ADMIN', 1, '2026-03-06 09:50:05'),
	(2, 'Juan Pérez', 'jperez@pj.gov.ar', '$2b$10$H6F8VQvLtPBrU1IDaYS9vOEOrybQqMxunu5uLnL4hl.Aa8SCmkTCS', 'TECNICO', 1, '2026-03-06 10:46:27'),
	(5, 'mariela', 'msadker@pj.gov.ar', '$2b$10$zh47zroilp7AvazzNsbC0ejm1SzhEbp/o9Drkns3yLqpf1GJ0DUlO', 'TECNICO', NULL, '2026-03-06 11:16:09'),
	(7, 'Marcelo', 'marcelo@pj.gov.ar', '$2b$10$DE9TMUdj3LrvJwirwwV3E.LR6cTax2Gs4HMkYL24jh3WYQtZ7C7PG', 'OPERADOR', 1, '2026-03-06 18:22:59');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
