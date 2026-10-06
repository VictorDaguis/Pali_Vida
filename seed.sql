USE palivida;

-- 1. Administrador fictício
INSERT INTO administradores (nome, email, senha_hash, conselho_profissional, formacao, registro_profissional, especialidade)
VALUES ('Ana Souza (Adm)', 'ana.souza@palivida.test', 'hash_ficticio_abc123', 'Coren-PR', 'Enfermagem', '123456-PR', 'Cuidados Paliativos');

-- 2. Paciente fictício
INSERT INTO pacientes (nome, email, senha_hash, celular, genero, data_nascimento, cidade, estado, tipo_sanguineo, condicoes_medicas, medicacao, contato_emergencia, unidades_de_saude)
VALUES ('João da Silva (Paciente)', 'joao.silva@palivida.test', 'hash_ficticio_def456', '(43) 99999-9999', 'Masculino', '1965-04-12', 'Londrina', 'PR', 'O+', 'Condição de acompanhamento paliativo', 'Medicação de suporte padrão', 'Maria Silva: (43) 98888-8888', 'UBS Local Londrina');

-- 3. Acompanhante fictício
INSERT INTO acompanhantes (nome, email, senha_hash, telefone, genero, data_nascimento, relacionamento)
VALUES ('Maria Silva (Cuidadora)', 'maria.silva@palivida.test', 'hash_ficticio_ghi789', '(43) 98888-8888', 'Feminino', '1968-09-20', 'Cônjuge');

-- 4. Vínculo entre paciente e acompanhante
INSERT INTO vinculos (paciente_id, acompanhante_id)
VALUES (1, 1);

-- 5. Sintomas de demonstração
INSERT INTO sintomas (nome_sintoma) VALUES 
('Dor'),
('Fadiga'),
('Náusea'),
('Falta de ar'),
('Ansiedade');

-- 6. Registros de sintomas de demonstração
INSERT INTO registros (paciente_id, sintoma_id, intensidade, data_registro)
VALUES 
(1, 1, 4, '2026-10-01 08:30:00'),
(1, 2, 6, '2026-10-01 14:00:00'),
(1, 3, 2, '2026-10-02 09:15:00');

-- 7. Conteúdos educativos de demonstração
INSERT INTO conteudos (titulo, descricao, texto, sinais_sintomas, sinais_alerta, data_post)
VALUES 
('Orientações Iniciais sobre Conforto', 'Dicas gerais para o bem-estar diário e gestão de sintomas.', 'Texto detalhado sobre estratégias de conforto e acompanhamento domiciliário.', 'Identificação precoce de desconforto leve.', 'Procure assistência médica imediata em caso de falta de ar severa ou dor incontrolável.', '2026-10-01 10:00:00');