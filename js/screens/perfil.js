/**
 * Prontuário — porta de screens/perfil/index.tsx + PerfilPaciente.tsx +
 * PerfilAcompanhante.tsx + PerfilAdministrador.tsx + campos.tsx.
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};

(function () {
  const { escaparHtml, aviso, spinner, selectOpcoes, GENEROS, TIPOS_SANGUINEOS, UFS } = PV.ui;

  const validar = {
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()),
    telefone: (v) => !v || /^\d{10,11}$/.test(String(v).replace(/\D/g, '')),
    data: (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(String(v).trim()),
  };
  const soData = (v) => (!v ? '' : String(v).split('T')[0].split(' ')[0].slice(0, 10));

  function campoTexto(id, label, valor, opts = {}) {
    const { placeholder = '', tipo = 'text', multiline = false } = opts;
    const attrs = `id="${id}" placeholder="${escaparHtml(placeholder)}"`;
    return `
      <label class="pv-campo-label" for="${id}">${escaparHtml(label)}</label>
      ${multiline
        ? `<textarea class="pv-campo-input" ${attrs}>${escaparHtml(valor)}</textarea>`
        : `<input class="pv-campo-input" type="${tipo}" ${attrs} value="${escaparHtml(valor)}">`}`;
  }

  function campoSelecao(id, label, valor, opcoes, placeholder) {
    return `
      <label class="pv-campo-label" for="${id}">${escaparHtml(label)}</label>
      <select class="pv-campo-select" id="${id}">${selectOpcoes(opcoes, valor, placeholder || 'Selecione')}</select>`;
  }

  async function botaoSalvarAsync(botao, acao) {
    botao.disabled = true;
    const original = botao.textContent;
    botao.innerHTML = spinner(true);
    try {
      await acao();
    } finally {
      botao.disabled = false;
      botao.textContent = original;
    }
  }

  /* ======================================================= PerfilPaciente === */
  // Preenchimento em etapas (wizard), um passo de cada vez, com barra de
  // progresso — mesmo sistema que era usado na antiga tela "Carteirinha de
  // identificação" (unificada aqui: mesmo propósito, um nome só,
  // "Prontuário"). Os dados continuam sendo os do prontuário real do
  // paciente (PV.db.pacientes), não um documento à parte.
  const PASSOS_PRONTUARIO = [
    { titulo: 'Dados pessoais', campos: [
      { id: 'nome', label: 'Nome completo', obrig: true, placeholder: 'Digite o nome completo' },
      { id: 'nome_social', label: 'Nome social (opcional)', placeholder: 'Se houver' },
      { id: 'data_nascimento', label: 'Data de nascimento', tipo: 'date' },
      { id: 'genero', label: 'Gênero', tipo: 'selecao', opcoes: GENEROS, placeholder: 'Selecione o gênero' },
    ] },
    { titulo: 'Contato e acesso', campos: [
      { id: 'email', label: 'E-mail', tipo: 'email', obrig: true },
      { id: 'senha', label: 'Senha', tipo: 'password', placeholder: 'Deixe em branco para não alterar' },
      { id: 'celular', label: 'Celular', placeholder: 'Somente números (com DDD)' },
      { id: 'cidade', label: 'Cidade', placeholder: '' },
      { id: 'estado', label: 'Estado (UF)', tipo: 'selecao', opcoes: UFS, placeholder: 'Selecione a UF' },
    ] },
    { titulo: 'Saúde e diagnóstico', campos: [
      { id: 'tipo_sanguineo', label: 'Tipo sanguíneo', tipo: 'selecao', opcoes: TIPOS_SANGUINEOS, placeholder: 'Selecione' },
      { id: 'condicoes_medicas', label: 'Condições médicas (diagnóstico)', multiline: true, largo: true },
      { id: 'medicacao', label: 'Medicação de uso contínuo', largo: true },
    ] },
    { titulo: 'Equipe de saúde e emergência', campos: [
      { id: 'contato_emergencia', label: 'Contato de emergência', placeholder: 'Nome e telefone' },
      { id: 'unidades_de_saude', label: 'Unidades de saúde', placeholder: 'Hospital, UBS ou clínica de referência', largo: true },
    ] },
  ];

  function campoWizardHtml(prefixo, c, valor) {
    if (c.tipo === 'selecao') {
      return `
        <div class="pv-carteirinha-campo${c.largo ? ' largo' : ''}">
          <label class="campo-label" for="${prefixo}-${c.id}">${escaparHtml(c.label)}${c.obrig ? ' *' : ''}</label>
          <select class="campo" id="${prefixo}-${c.id}">${selectOpcoes(c.opcoes, valor, c.placeholder)}</select>
        </div>`;
    }
    const tipo = c.tipo || 'text';
    const attrs = `id="${prefixo}-${c.id}" placeholder="${escaparHtml(c.placeholder || '')}"`;
    const campo = c.multiline
      ? `<textarea class="campo" ${attrs} rows="3">${escaparHtml(valor)}</textarea>`
      : `<input class="campo" type="${tipo}" ${attrs} value="${escaparHtml(valor)}">`;
    return `
      <div class="pv-carteirinha-campo${c.largo ? ' largo' : ''}">
        <label class="campo-label" for="${prefixo}-${c.id}">${escaparHtml(c.label)}${c.obrig ? ' *' : ''}</label>
        ${campo}
      </div>`;
  }

  /** Wizard de preenchimento do prontuário — reaproveitado para o próprio
   * paciente e (em modo somente-dados, sem senha) para um paciente vinculado
   * a um acompanhante. onSalvar(dados) recebe o formulário completo. */
  function montarWizardProntuario(container, { valoresIniciais, comSenha, onSalvar, avisar, prefixo }) {
    const passos = PASSOS_PRONTUARIO;
    let etapa = 1;
    const form = { ...valoresIniciais };

    function telaEtapa() {
      const passo = passos[etapa - 1];
      const progresso = Math.round((etapa / passos.length) * 100);
      const campos = comSenha ? passo.campos : passo.campos.filter((c) => c.id !== 'senha');
      return `
        <div class="pv-carteirinha-progresso">
          <div class="pv-carteirinha-progresso-barra"><div style="width:${progresso}%"></div></div>
          <span>Passo ${etapa} de ${passos.length} — ${escaparHtml(passo.titulo)}</span>
        </div>
        <div class="pv-carteirinha-form">
          ${campos.map((c) => campoWizardHtml(prefixo, c, form[c.id] || '')).join('')}
        </div>
        <div id="${prefixo}-erro"></div>
        <div class="pv-carteirinha-nav">
          ${etapa > 1 ? `<button type="button" class="botao-voltar" id="${prefixo}-voltar">Voltar</button>` : ''}
          ${etapa < passos.length
            ? `<button type="button" class="botao-enviar" id="${prefixo}-avancar">Continuar</button>`
            : `<button type="button" class="botao-enviar" id="${prefixo}-finalizar">Salvar prontuário</button>`}
        </div>`;
    }

    function ligarCamposEtapa() {
      passos[etapa - 1].campos.forEach((c) => {
        const el = container.querySelector(`#${prefixo}-${c.id}`);
        if (el) el.addEventListener('input', () => { form[c.id] = el.value; });
      });
    }

    function validarEtapa() {
      for (const c of passos[etapa - 1].campos) {
        if (c.obrig && !String(form[c.id] || '').trim()) {
          return `Preencha os campos obrigatórios (*). Faltou: ${c.label}.`;
        }
      }
      if (passos[etapa - 1].titulo === 'Contato e acesso') {
        if (!validar.email(form.email)) return 'E-mail inválido. Use o formato algo@dominio.com';
        if (!validar.telefone(form.celular)) return 'Celular inválido (10 ou 11 dígitos, com DDD).';
      }
      return null;
    }

    function montar() {
      container.innerHTML = telaEtapa();
      ligarCamposEtapa();

      const voltar = container.querySelector(`#${prefixo}-voltar`);
      if (voltar) voltar.addEventListener('click', () => { etapa--; montar(); });

      const avancar = container.querySelector(`#${prefixo}-avancar`);
      if (avancar) avancar.addEventListener('click', () => {
        const msg = validarEtapa();
        if (msg) { container.querySelector(`#${prefixo}-erro`).innerHTML = aviso({ tipo: 'erro', texto: msg }); return; }
        container.querySelector(`#${prefixo}-erro`).innerHTML = '';
        etapa++;
        montar();
      });

      const finalizar = container.querySelector(`#${prefixo}-finalizar`);
      if (finalizar) finalizar.addEventListener('click', async () => {
        const msg = validarEtapa();
        if (msg) { container.querySelector(`#${prefixo}-erro`).innerHTML = aviso({ tipo: 'erro', texto: msg }); return; }
        await botaoSalvarAsync(finalizar, () => onSalvar(form));
      });
    }

    montar();
  }

  async function montarPerfilPaciente(container, id, avisar) {
    container.innerHTML = `<div class="pv-carregando" style="min-height:120px">${spinner()}</div>`;
    let dados, listaAcompanhantes;
    try {
      dados = await PV.db.pacientes.buscar(id);
      listaAcompanhantes = await PV.db.pacientes.acompanhantes(id);
    } catch (e) {
      avisar({ tipo: 'erro', texto: e.message || 'Não foi possível carregar seus dados.' });
      container.innerHTML = '';
      return;
    }

    const nomeSidebar = container.closest('.pv-prontuario-modern')?.querySelector('#pv-sidebar-paciente-name');
    if (nomeSidebar) nomeSidebar.textContent = dados.nome_social || dados.nome || 'Paciente';

    const valoresIniciais = {
      nome: dados.nome || '', nome_social: dados.nome_social || '', email: dados.email || '', senha: '',
      celular: dados.celular || '', genero: dados.genero || '', data_nascimento: soData(dados.data_nascimento),
      cidade: dados.cidade || '', estado: dados.estado || '', tipo_sanguineo: dados.tipo_sanguineo || '',
      condicoes_medicas: dados.condicoes_medicas || '', medicacao: dados.medicacao || '',
      contato_emergencia: dados.contato_emergencia || '', unidades_de_saude: dados.unidades_de_saude || '',
    };

    container.innerHTML = `
      <div class="pv-card">
        <div class="subtitulo">Seus dados</div>
        <div id="pp-wizard"></div>
      </div>

      <div class="pv-card">
        <div class="subtitulo">Meus acompanhantes</div>
        <div id="pp-acompanhantes"></div>
      </div>`;

    montarWizardProntuario(container.querySelector('#pp-wizard'), {
      valoresIniciais, comSenha: true, avisar, prefixo: 'pp',
      onSalvar: async (form) => {
        try {
          await PV.db.pacientes.atualizar(id, {
            ...form, senha: form.senha || null,
            estado: form.estado ? form.estado.toUpperCase() : null,
            tipo_sanguineo: form.tipo_sanguineo || null,
          });
          avisar({ tipo: 'sucesso', texto: 'Seu prontuário foi atualizado!' });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Erro ao atualizar.' });
        }
      },
    });

    function renderAcompanhantes() {
      const alvo = container.querySelector('#pp-acompanhantes');
      if (!listaAcompanhantes.length) {
        alvo.innerHTML = `<span class="pv-campo-label">Você ainda não tem acompanhantes vinculados.</span>`;
        return;
      }
      alvo.innerHTML = listaAcompanhantes.map((a) => `
        <div class="pv-item-vinculo" data-id="${a.id}">
          <div class="subtitulo" style="font-size:16px">${escaparHtml(a.nome_completo || '(sem nome)')}</div>
          <span class="pv-campo-label">${escaparHtml(a.email)}</span>
          <button type="button" class="pv-botao-perigo" data-remover="${a.id}">Remover vínculo</button>
        </div>`).join('');
      alvo.querySelectorAll('[data-remover]').forEach((b) => b.addEventListener('click', async () => {
        try {
          await PV.db.vinculos.remover(b.dataset.remover, id);
          listaAcompanhantes = listaAcompanhantes.filter((a) => String(a.id) !== b.dataset.remover);
          renderAcompanhantes();
          avisar({ tipo: 'sucesso', texto: 'Vínculo removido.' });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Erro ao desvincular.' });
        }
      }));
    }
    renderAcompanhantes();
  }

  /* =================================================== PerfilAcompanhante === */
  async function montarPerfilAcompanhante(container, id, avisar) {
    container.innerHTML = `<div class="pv-carregando" style="min-height:120px">${spinner()}</div>`;
    let dados, listaPacientes;
    try {
      dados = await PV.db.acompanhantes.buscar(id);
      listaPacientes = await PV.db.acompanhantes.pacientes(id);
    } catch (e) {
      avisar({ tipo: 'erro', texto: e.message || 'Não foi possível carregar seus dados.' });
      container.innerHTML = '';
      return;
    }

    const expandido = {};

    container.innerHTML = `
      <div class="pv-card">
        <div class="subtitulo">Seus dados</div>
        ${campoTexto('pa-nome_completo', 'Nome completo', dados.nome_completo || '')}
        ${campoTexto('pa-nome_social', 'Nome social', dados.nome_social || '')}
        ${campoTexto('pa-email', 'E-mail', dados.email || '', { tipo: 'email' })}
        ${campoTexto('pa-senha', 'Senha', '', { tipo: 'password', placeholder: 'Deixe em branco para não alterar' })}
        ${campoTexto('pa-telefone', 'Telefone', dados.telefone || '', { placeholder: 'Somente números (com DDD)' })}
        ${campoSelecao('pa-genero', 'Gênero', dados.genero || '', GENEROS, 'Selecione o gênero')}
        ${campoTexto('pa-data_nascimento', 'Data de nascimento', soData(dados.data_nascimento), { placeholder: 'AAAA-MM-DD' })}
        <button type="button" class="pv-botao-primario" id="pa-salvar">Salvar</button>
      </div>

      <div class="pv-card">
        <div class="subtitulo">Vínculos com pacientes</div>
        ${campoTexto('pa-codigo', 'Vincular por código do paciente', '', { placeholder: 'Digite o código do seu paciente' })}
        <button type="button" class="pv-botao-secundario" id="pa-vincular">Vincular</button>

        <div class="subtitulo" style="margin-top:16px">Meus pacientes</div>
        <div id="pa-pacientes"></div>
      </div>`;

    function renderPacientes() {
      const alvo = container.querySelector('#pa-pacientes');
      if (!listaPacientes.length) {
        alvo.innerHTML = `<span class="pv-campo-label">Nenhum vínculo ainda.</span>`;
        return;
      }
      alvo.innerHTML = listaPacientes.map((p) => `
        <div class="pv-item-vinculo" data-paciente="${p.id}">
          <div class="subtitulo" style="font-size:16px">${escaparHtml(p.nome || '(sem nome)')} — Código: ${p.id}</div>
          <span class="pv-campo-label">${escaparHtml(p.email)}</span>
          <button type="button" class="pv-botao-secundario" data-ver="${p.id}">Ver dados completos</button>
          <div data-slot-detalhes="${p.id}"></div>
          <button type="button" class="pv-botao-perigo" data-desvincular="${p.id}">Remover vínculo</button>
        </div>`).join('');

      alvo.querySelectorAll('[data-ver]').forEach((b) => b.addEventListener('click', async () => {
        const pid = b.dataset.ver;
        const slot = alvo.querySelector(`[data-slot-detalhes="${pid}"]`);
        if (expandido[pid]) {
          expandido[pid] = null;
          slot.innerHTML = '';
          b.textContent = 'Ver dados completos';
          return;
        }
        try {
          const p = await PV.db.pacientes.buscar(pid);
          expandido[pid] = p;
          const valoresIniciais = {
            nome: p.nome || '', nome_social: p.nome_social || '', email: p.email || '',
            celular: p.celular || '', genero: p.genero || '', data_nascimento: soData(p.data_nascimento),
            cidade: p.cidade || '', estado: p.estado || '', tipo_sanguineo: p.tipo_sanguineo || '',
            condicoes_medicas: p.condicoes_medicas || '', medicacao: p.medicacao || '',
            contato_emergencia: p.contato_emergencia || '', unidades_de_saude: p.unidades_de_saude || '',
          };
          slot.innerHTML = `<div style="margin-top:12px" data-detalhes="${pid}"></div>`;
          b.textContent = 'Ocultar dados';
          montarWizardProntuario(slot.querySelector(`[data-detalhes="${pid}"]`), {
            valoresIniciais, comSenha: false, avisar, prefixo: `pa-${pid}`,
            onSalvar: async (form) => {
              try {
                await PV.db.pacientes.atualizar(pid, {
                  ...form, senha: null,
                  estado: form.estado ? form.estado.toUpperCase() : null,
                  tipo_sanguineo: form.tipo_sanguineo || null,
                });
                avisar({ tipo: 'sucesso', texto: 'Prontuário do paciente atualizado!' });
              } catch (e) {
                avisar({ tipo: 'erro', texto: e.message || 'Erro ao atualizar paciente.' });
              }
            },
          });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Não foi possível carregar o paciente.' });
        }
      }));

      alvo.querySelectorAll('[data-desvincular]').forEach((b) => b.addEventListener('click', async () => {
        try {
          await PV.db.vinculos.remover(id, b.dataset.desvincular);
          listaPacientes = listaPacientes.filter((p) => String(p.id) !== b.dataset.desvincular);
          renderPacientes();
          avisar({ tipo: 'sucesso', texto: 'Vínculo removido.' });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Falha ao desvincular.' });
        }
      }));
    }
    renderPacientes();

    container.querySelector('#pa-salvar').addEventListener('click', async () => {
      const v = (campo) => container.querySelector('#pa-' + campo).value;
      const novoForm = {
        nome_completo: v('nome_completo'), nome_social: v('nome_social'), email: v('email'), senha: v('senha'),
        telefone: v('telefone'), genero: v('genero'), data_nascimento: v('data_nascimento'),
      };
      if (!validar.email(novoForm.email)) return avisar({ tipo: 'erro', texto: 'E-mail inválido. Use o formato algo@dominio.com' });
      if (!validar.telefone(novoForm.telefone)) return avisar({ tipo: 'erro', texto: 'Telefone inválido (10 ou 11 dígitos, com DDD).' });

      await botaoSalvarAsync(container.querySelector('#pa-salvar'), async () => {
        try {
          await PV.db.acompanhantes.atualizar(id, { ...novoForm, senha: novoForm.senha || null, data_nascimento: soData(novoForm.data_nascimento) || null });
          container.querySelector('#pa-senha').value = '';
          avisar({ tipo: 'sucesso', texto: 'Seus dados foram atualizados.' });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Erro ao atualizar.' });
        }
      });
    });

    container.querySelector('#pa-vincular').addEventListener('click', async () => {
      const campo = container.querySelector('#pa-codigo');
      const pacienteId = Number(campo.value);
      if (!pacienteId) return avisar({ tipo: 'erro', texto: 'Informe um código de paciente válido.' });
      try {
        await PV.db.vinculos.criar(pacienteId);
        campo.value = '';
        listaPacientes = await PV.db.acompanhantes.pacientes(id);
        renderPacientes();
        avisar({ tipo: 'sucesso', texto: 'Vínculo criado com sucesso.' });
      } catch (e) {
        avisar({ tipo: 'erro', texto: e.message || 'Falha ao vincular.' });
      }
    });
  }

  /* ================================================== PerfilAdministrador === */
  async function montarPerfilAdministrador(container, id, avisar) {
    container.innerHTML = `<div class="pv-carregando" style="min-height:120px">${spinner()}</div>`;
    let dados;
    try {
      dados = await PV.db.administradores.buscar(id);
    } catch (e) {
      avisar({ tipo: 'erro', texto: e.message || 'Não foi possível carregar seus dados.' });
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="pv-card">
        <div class="subtitulo">Seus dados</div>
        ${campoTexto('pd-nome', 'Nome completo', dados.nome || '')}
        ${campoTexto('pd-nome_social', 'Nome social (opcional)', dados.nome_social || '')}
        ${campoTexto('pd-email', 'E-mail', dados.email || '', { tipo: 'email' })}
        ${campoTexto('pd-senha', 'Senha', '', { tipo: 'password', placeholder: 'Deixe em branco para não alterar' })}
        ${campoTexto('pd-telefone', 'Telefone', dados.telefone || '', { placeholder: 'Somente números (com DDD)' })}
        ${campoSelecao('pd-genero', 'Gênero', dados.genero || '', GENEROS, 'Selecione o gênero')}
        ${campoTexto('pd-data_nascimento', 'Data de nascimento', soData(dados.data_nascimento), { placeholder: 'AAAA-MM-DD' })}
        ${campoTexto('pd-conselho_profissional', 'Conselho profissional', dados.conselho_profissional || '', { placeholder: 'Ex: CRM, CRP' })}
        ${campoTexto('pd-formacao', 'Formação', dados.formacao || '', { placeholder: 'Ex: Medicina, Psicologia' })}
        ${campoTexto('pd-registro_profissional', 'Registro profissional', dados.registro_profissional || '')}
        ${campoTexto('pd-especialidade', 'Especialidade', dados.especialidade || '', { placeholder: 'Ex: Oncologia' })}
        <button type="button" class="pv-botao-primario" id="pd-salvar">Salvar</button>
      </div>`;

    container.querySelector('#pd-salvar').addEventListener('click', async () => {
      const v = (campo) => container.querySelector('#pd-' + campo).value;
      const novoForm = {
        nome: v('nome'), nome_social: v('nome_social'), email: v('email'), senha: v('senha'), telefone: v('telefone'),
        genero: v('genero'), data_nascimento: v('data_nascimento'), conselho_profissional: v('conselho_profissional'),
        formacao: v('formacao'), registro_profissional: v('registro_profissional'), especialidade: v('especialidade'),
      };
      if (!validar.email(novoForm.email)) return avisar({ tipo: 'erro', texto: 'E-mail inválido. Use o formato algo@dominio.com' });
      if (!validar.telefone(novoForm.telefone)) return avisar({ tipo: 'erro', texto: 'Telefone inválido (10 ou 11 dígitos, com DDD).' });

      await botaoSalvarAsync(container.querySelector('#pd-salvar'), async () => {
        try {
          await PV.db.administradores.atualizar(id, { ...novoForm, senha: novoForm.senha || null, data_nascimento: soData(novoForm.data_nascimento) || null });
          container.querySelector('#pd-senha').value = '';
          avisar({ tipo: 'sucesso', texto: 'Seus dados foram atualizados.' });
        } catch (e) {
          avisar({ tipo: 'erro', texto: e.message || 'Erro ao atualizar.' });
        }
      });
    });
  }

  /* ========================================================= PerfilConta === */
  async function perfilConta(main, ctx) {
    if (ctx.usuario.tipo !== 'paciente') {
      PV.router.navegar('/perfil');
      return;
    }

    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }

    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-perfil-conta-main');
    main.classList.add('pv-dashboard-paciente-main');

    main.innerHTML = `
      <div class="pv-perfil-conta-modern">
        ${PV.ui.sidebarPaciente('perfil')}

        <section class="pv-perfil-conta-workspace">
          <header class="pv-perfil-conta-topbar">
            <span class="pv-perfil-conta-topbar-title">Meu cuidado</span>
            <div class="pv-perfil-conta-topbar-actions">
              <span class="pv-perfil-conta-demo">Protótipo demonstrativo</span>
              <button type="button" class="pv-perfil-conta-topbar-icon" data-rota="/busca" aria-label="Pesquisar conteúdos" title="Pesquisar conteúdos">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg>
              </button>
              <button type="button" class="pv-perfil-conta-topbar-icon pv-perfil-conta-notification" data-rota="/triagem" aria-label="Abrir triagem" title="Abrir triagem">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>
                <span class="pv-perfil-conta-notification-dot" aria-hidden="true"></span>
              </button>
            </div>
          </header>

          <div class="pv-perfil-conta-content">
            <section class="pv-perfil-conta-heading">
              <span class="pv-perfil-conta-eyebrow">CONTA E PREFERÊNCIAS</span>
              <h1>Meu perfil</h1>
              <p>Confira suas informações de conta e mantenha seus dados atualizados.</p>
            </section>

            <div id="pv-perfil-conta-notice" aria-live="polite"></div>
            <div id="pv-perfil-conta-body" class="pv-perfil-conta-body">
              <div class="pv-perfil-conta-loading">
                ${spinner()}
                <span>Carregando seu perfil...</span>
              </div>
            </div>
          </div>

          <nav class="pv-perfil-conta-mobile-nav" aria-label="Navegação principal">
            <button type="button" data-rota="/home">
              ${PV.ui.iconeNavegacao ? PV.ui.iconeNavegacao('inicio') : '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"></path></svg>'}
              <span>Início</span>
            </button>
            <button type="button" data-rota="/menu-sintomas">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"></path></svg><span>Sintomas</span>
            </button>
            <button type="button" data-rota="/busca">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v12.5H8A2.5 2.5 0 0 1 5.5 17V5A.5.5 0 0 1 6 4.5Z"></path><path d="M8.5 8h6M8.5 11.5h6M8.5 15h4"></path></svg><span>Conteúdos</span>
            </button>
            <button type="button" class="active" aria-current="page" data-rota="/meu-perfil">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg><span>Perfil</span>
            </button>
          </nav>
        </section>
      </div>
    `;

    const layout = main.querySelector('.pv-perfil-conta-modern');
    const body = main.querySelector('#pv-perfil-conta-body');
    const notice = main.querySelector('#pv-perfil-conta-notice');

    PV.ui.ligarLogout(layout);
    layout.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });

    const valueHtml = (valor) => {
      const texto = String(valor ?? '').trim();
      return texto ? escaparHtml(texto) : '<span class="pv-perfil-conta-empty">Não informado</span>';
    };
    const dataHtml = (valor) => {
      const texto = String(valor ?? '').trim();
      if (!texto) return '<span class="pv-perfil-conta-empty">Não informado</span>';
      const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
      return escaparHtml(match ? `${match[3]}/${match[2]}/${match[1]}` : texto);
    };

    try {
      const paciente = await PV.db.pacientes.buscar(ctx.usuario.id);
      const nome = paciente?.nome_social || paciente?.nome || 'Paciente';
      const email = paciente?.email || ctx.usuario.email || '';
      const telefone = paciente?.celular || paciente?.telefone || '';
      const cidade = [paciente?.cidade, paciente?.estado].filter(Boolean).join(' — ');
      const iniciais = nome.split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte.charAt(0)).join('').toUpperCase() || 'PV';
      const nomeSidebar = layout.querySelector('#pv-sidebar-paciente-name');
      if (nomeSidebar) nomeSidebar.textContent = nome;

      body.innerHTML = `
        <section class="pv-perfil-conta-identity">
          <div class="pv-perfil-conta-avatar" aria-hidden="true">${escaparHtml(iniciais)}</div>
          <div class="pv-perfil-conta-identity-copy">
            <span class="pv-perfil-conta-section-label">PERFIL DO PACIENTE</span>
            <h2>${escaparHtml(nome)}</h2>
            <p>${valueHtml(email)}</p>
          </div>
          <span class="pv-perfil-conta-role"><span aria-hidden="true"></span> Paciente</span>
        </section>

        <div class="pv-perfil-conta-grid">
          <section class="pv-perfil-conta-card">
            <div class="pv-perfil-conta-card-heading">
              <span class="pv-perfil-conta-card-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>
              </span>
              <div><span class="pv-perfil-conta-section-label">IDENTIFICAÇÃO</span><h3>Dados pessoais</h3></div>
            </div>
            <dl class="pv-perfil-conta-data-list">
              <div><dt>Nome completo</dt><dd>${valueHtml(paciente?.nome)}</dd></div>
              <div><dt>Nome social</dt><dd>${valueHtml(paciente?.nome_social)}</dd></div>
              <div><dt>Data de nascimento</dt><dd>${dataHtml(paciente?.data_nascimento)}</dd></div>
              <div><dt>Gênero</dt><dd>${valueHtml(paciente?.genero)}</dd></div>
            </dl>
          </section>

          <section class="pv-perfil-conta-card">
            <div class="pv-perfil-conta-card-heading">
              <span class="pv-perfil-conta-card-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>
              </span>
              <div><span class="pv-perfil-conta-section-label">ACESSO E CONTATO</span><h3>Dados da conta</h3></div>
            </div>
            <dl class="pv-perfil-conta-data-list">
              <div><dt>E-mail</dt><dd>${valueHtml(email)}</dd></div>
              <div><dt>Celular</dt><dd>${valueHtml(telefone)}</dd></div>
              <div><dt>Cidade e estado</dt><dd>${valueHtml(cidade)}</dd></div>
              <div><dt>Código do paciente</dt><dd>${valueHtml(paciente?.id ?? ctx.usuario.id)}</dd></div>
            </dl>
          </section>
        </div>

        <section class="pv-perfil-conta-help">
          <span class="pv-perfil-conta-help-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></svg>
          </span>
          <div>
            <h3>Precisa atualizar suas informações?</h3>
            <p>No Prontuário você pode editar seus dados pessoais, informações de saúde e contatos de emergência.</p>
          </div>
          <button type="button" class="pv-perfil-conta-cta" data-rota="/perfil">
            Ir para o prontuário
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
          </button>
        </section>
      `;

      // O botão de ação dentro do conteúdo também usa o roteador comum.
      body.querySelectorAll('[data-rota]').forEach((botao) => {
        botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
      });
    } catch (e) {
      notice.innerHTML = aviso({ tipo: 'erro', texto: e.message || 'Não foi possível carregar seu perfil.' });
      body.innerHTML = `
        <section class="pv-perfil-conta-error">
          <h2>Não foi possível carregar seu perfil</h2>
          <p>Verifique sua conexão e tente novamente.</p>
          <button type="button" class="pv-perfil-conta-cta" id="pv-perfil-conta-retry">Tentar novamente</button>
        </section>`;
      body.querySelector('#pv-perfil-conta-retry').addEventListener('click', () => PV.router.renderizar());
    }
  }

  /* ============================================================= dispatcher === */
  async function perfil(main, ctx) {
    const ehPaciente = ctx.usuario.tipo === 'paciente';
    let tela = main;

    if (ehPaciente) {
      main.classList.remove('pv-sem-scroll');
      main.classList.add('pv-dashboard-paciente-main');

      const header = document.getElementById('app-header');
      const footer = document.getElementById('app-footer');
      if (header) { header.hidden = true; header.innerHTML = ''; }
      if (footer) { footer.hidden = true; footer.innerHTML = ''; }

      main.innerHTML = `
        <div class="pv-prontuario-modern">
          ${PV.ui.sidebarPaciente('prontuario')}

          <section class="pv-prontuario-workspace">
            <header class="pv-prontuario-topbar">
              <span class="pv-prontuario-topbar-title">Meu cuidado</span>
              <div class="pv-prontuario-topbar-actions">
                <span class="pv-prontuario-demo">Protótipo demonstrativo</span>
                <button type="button" class="pv-prontuario-topbar-icon" data-rota="/busca" aria-label="Pesquisar conteúdos">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg>
                </button>
                <button type="button" class="pv-prontuario-topbar-icon" data-rota="/triagem" aria-label="Abrir triagem">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>
                  <span class="pv-prontuario-notification-dot" aria-hidden="true"></span>
                </button>
              </div>
            </header>

            <div class="pv-prontuario-content">
              <section class="pv-prontuario-heading">
                <span class="pv-prontuario-eyebrow">INFORMAÇÕES DE SAÚDE</span>
                <h1>Prontuário</h1>
                <p>Mantenha seus dados e informações de cuidado atualizados.</p>
              </section>
              <div class="pv-prontuario-body" id="pv-prontuario-body"></div>
            </div>
          </section>
        </div>

        <nav class="pv-prontuario-mobile-nav" aria-label="Navegação principal">
          <button type="button" data-rota="/home">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"></path></svg><span>Início</span>
          </button>
          <button type="button" data-rota="/menu-sintomas">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"></path></svg><span>Sintomas</span>
          </button>
          <button type="button" data-rota="/busca">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v12.5H8A2.5 2.5 0 0 1 5.5 17V5A.5.5 0 0 1 6 4.5Z"></path><path d="M8.5 8h6M8.5 11.5h6M8.5 15h4"></path></svg><span>Conteúdos</span>
          </button>
          <button type="button" class="active" aria-current="page" data-rota="/perfil">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg><span>Prontuário</span>
          </button>
        </nav>
      `;
      tela = main.querySelector('#pv-prontuario-body');
      main.querySelectorAll('[data-rota]').forEach((botao) => {
        botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
      });
    }

    tela.innerHTML = `
      <div class="tela-perfil">
        <h1 class="titulo">Prontuário</h1>
        <div id="perfil-aviso"></div>

        <div class="pv-card">
          <div class="subtitulo">Seu código</div>
          <input class="pv-campo-input pv-codigo-readonly" value="${ctx.usuario.id}" readonly>
        </div>

        <div id="perfil-variante"></div>

        <div class="pv-card">
          <button type="button" class="pv-botao-logout" id="btn-sair" data-sair>Sair da conta</button>
          <button type="button" class="pv-botao-secundario" id="btn-resetar" style="background:none;color:var(--cinza-claro);box-shadow:none;text-decoration:underline;margin-top:18px">Restaurar dados de demonstração</button>
        </div>
      </div>`;

    const avisoEl = main.querySelector('#perfil-aviso');
    const avisar = (m) => { avisoEl.innerHTML = aviso(m); };
    const slot = main.querySelector('#perfil-variante');

    // A sidebar compartilhada é a única saída principal para pacientes.
    // O botão legado de logout segue no DOM por compatibilidade, mas fica
    // oculto visualmente no layout novo.
    PV.ui.ligarLogout(main);
    main.querySelector('#btn-resetar').addEventListener('click', () => {
      if (!confirm('Isso apaga tudo que foi alterado nesta demonstração (cadastros novos, registros, conteúdos) e volta aos dados iniciais. Continuar?')) return;
      PV.db.resetarDados();
      PV.session.limparSessao();
      PV.router.navegar('/login');
    });

    if (ctx.usuario.tipo === 'paciente') await montarPerfilPaciente(slot, ctx.usuario.id, avisar);
    else if (ctx.usuario.tipo === 'acompanhante') await montarPerfilAcompanhante(slot, ctx.usuario.id, avisar);
    else if (ctx.usuario.tipo === 'administrador') await montarPerfilAdministrador(slot, ctx.usuario.id, avisar);
  }
  PV.screens.perfilConta = perfilConta;
  PV.screens.perfil = perfil;
})();
