-- Criar o schema palivida com suporte a UTF-8
CREATE DATABASE IF NOT EXISTS palivida
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE palivida;

-- 1. Tabela administradores
CREATE TABLE IF NOT EXISTS administradores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  nome_social VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  genero VARCHAR(50),
  data_nascimento DATE,
  conselho_profissional VARCHAR(50),
  formacao VARCHAR(150),
  registro_profissional VARCHAR(100),
  especialidade VARCHAR(150),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Tabela pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  nome_social VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  celular VARCHAR(20),
  genero VARCHAR(50),
  data_nascimento DATE,
  cidade VARCHAR(100),
  estado CHAR(2),
  tipo_sanguineo VARCHAR(5),
  condicoes_medicas TEXT,
  medicacao TEXT,
  contato_emergencia VARCHAR(255),
  unidades_de_saude TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Tabela acompanhantes
CREATE TABLE IF NOT EXISTS acompanhantes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  nome_social VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  genero VARCHAR(50),
  data_nascimento DATE,
  relacionamento VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Tabela sintomas
CREATE TABLE IF NOT EXISTS sintomas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome_sintoma VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Tabela conteudos
CREATE TABLE IF NOT EXISTS conteudos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  texto LONGTEXT,
  sinais_sintomas LONGTEXT,
  sinais_alerta LONGTEXT,
  data_post DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Tabela registros (com restrição de intensidade 0-10)
CREATE TABLE IF NOT EXISTS registros (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT UNSIGNED NOT NULL,
  sintoma_id INT UNSIGNED NOT NULL,
  intensidade TINYINT UNSIGNED NOT NULL,
  data_registro DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registros_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_registros_sintoma FOREIGN KEY (sintoma_id) REFERENCES sintomas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_intensidade CHECK (intensidade BETWEEN 0 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Tabela vinculos (com chave única composta)
CREATE TABLE IF NOT EXISTS vinculos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT UNSIGNED NOT NULL,
  acompanhante_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vinculos_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_vinculos_acompanhante FOREIGN KEY (acompanhante_id) REFERENCES acompanhantes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT uk_paciente_acompanhante UNIQUE (paciente_id, acompanhante_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;