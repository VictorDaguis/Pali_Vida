/**
 * Telas administrativas do PaliVida.
 * Mantém os dados reais do PV.db e compartilha o mesmo shell visual em todas
 * as rotas administrativas.
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};
window.PV.ui = window.PV.ui || {};

(function () {
  const esc = PV.ui.escaparHtml;
  const icon = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    patients: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    records: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 9h8M8 13h8M8 17h5"/>',
    symptoms: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    contents: '<path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v13H8A2.5 2.5 0 0 1 5.5 17V5A.5.5 0 0 1 6 4.5Z"/><path d="M8.5 8h6M8.5 11.5h6M8.5 15h4"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5Z"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
  };
  function svg(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon[name] || ''}</svg>`;
  }
  function initials(name) {
    return String(name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'AD';
  }
  function formatDate(value, withTime = false) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    const hoje = new Date();
    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    let day = sameDay(date, hoje) ? 'Hoje' : sameDay(date, ontem) ? 'Ontem' : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    if (withTime) day += `, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return day;
  }
  function notify(target, message, type = 'error') {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    el.innerHTML = `<div class="pv-admin-alert ${type === 'success' ? 'is-success' : ''}" role="status">${esc(message)}</div>`;
  }
  function setLoading(target, message = 'Carregando informações...') {
    target.innerHTML = `<div class="pv-admin-state">${esc(message)}</div>`;
  }
  function navButton(key, label, href, active) {
    return `<button type="button" class="pv-admin-nav-item${active === key ? ' active' : ''}" data-rota="${href}" ${active === key ? 'aria-current="page"' : ''}>${svg(key === 'home' ? 'overview' : key)}<span>${label}</span></button>`;
  }
  function montarLayoutAdmin(main, ativa, ctx) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-admin-dashboard-main');
    document.body.classList.add('pv-admin-dashboard');
    const shell = document.querySelector('.app-shell');
    if (shell) shell.classList.add('pv-admin-dashboard');

    main.innerHTML = `
      <div class="pv-admin-shell">
        <aside class="pv-admin-sidebar" aria-label="Navegação administrativa">
          <div class="pv-admin-sidebar-top">
            <a class="pv-admin-brand" href="#/home" aria-label="PaliVida — visão geral"><img src="assets/img/logo-completo.png" alt="PaliVida"></a>
            <div class="pv-admin-section-label">ADMINISTRAÇÃO</div>
            <nav class="pv-admin-nav">
              ${navButton('home', 'Visão geral', '/home', ativa)}
              ${navButton('patients', 'Pacientes', '/admin-pacientes', ativa)}
              ${navButton('records', 'Registros', '/admin-registros', ativa)}
              ${navButton('symptoms', 'Sintomas', '/admin-sintomas', ativa)}
              ${navButton('contents', 'Conteúdos', '/admin-conteudos', ativa)}
            </nav>
          </div>
          <div class="pv-admin-sidebar-footer">
            <div class="pv-admin-user"><span class="pv-admin-user-avatar" id="pv-admin-user-avatar">AD</span><span class="pv-admin-user-copy"><strong id="pv-admin-user-name">Administrador</strong><small>Administrador</small></span></div>
            <button class="pv-admin-logout" type="button" data-sair>${svg('logout')}<span>Sair</span></button>
          </div>
        </aside>
        <section class="pv-admin-workspace">
          <header class="pv-admin-topbar"><strong>Administração</strong><div class="pv-admin-topbar-actions"><span class="pv-admin-demo">Protótipo demonstrativo</span><button type="button" class="pv-admin-icon-button" data-admin-focus-search aria-label="Focar busca" title="Buscar">${svg('search')}</button><button type="button" class="pv-admin-icon-button pv-admin-bell" data-rota="/admin-registros" aria-label="Ver registros">${svg('bell')}<i></i></button></div></header>
          <main class="pv-admin-content" id="pv-admin-content-slot" tabindex="-1"></main>
          <nav class="pv-admin-mobile-nav" aria-label="Navegação administrativa">
            <button type="button" class="${ativa === 'home' ? 'active' : ''}" data-rota="/home">${svg('overview')}<small>Visão geral</small></button>
            <button type="button" class="${ativa === 'patients' ? 'active' : ''}" data-rota="/admin-pacientes">${svg('patients')}<small>Pacientes</small></button>
            <button type="button" class="${ativa === 'records' ? 'active' : ''}" data-rota="/admin-registros">${svg('records')}<small>Registros</small></button>
            <button type="button" class="${ativa === 'symptoms' ? 'active' : ''}" data-rota="/admin-sintomas">${svg('symptoms')}<small>Sintomas</small></button>
            <button type="button" class="${ativa === 'contents' ? 'active' : ''}" data-rota="/admin-conteudos">${svg('contents')}<small>Conteúdos</small></button>
          </nav>
        </section>
      </div>`;

    main.querySelectorAll('[data-rota]').forEach((button) => button.addEventListener('click', () => PV.router.navegar(button.dataset.rota)));
    main.querySelectorAll('[data-sair]').forEach((button) => button.addEventListener('click', () => { PV.session.limparSessao(); PV.router.navegar('/login'); }));
    main.querySelector('[data-admin-focus-search]')?.addEventListener('click', () => main.querySelector('.pv-admin-search-input, #busca-input')?.focus());

    const nameEl = main.querySelector('#pv-admin-user-name');
    const avatarEl = main.querySelector('#pv-admin-user-avatar');
    PV.db.administradores.buscar(ctx.usuario.id).then((admin) => {
      if (!main.isConnected) return;
      const name = admin?.nome || admin?.nome_completo || ctx.usuario.email?.split('@')[0] || 'Administrador';
      if (nameEl) nameEl.textContent = name;
      if (avatarEl) avatarEl.textContent = initials(name);
    }).catch(() => {
      const fallback = ctx.usuario.email?.split('@')[0] || 'Administrador';
      if (nameEl) nameEl.textContent = fallback;
      if (avatarEl) avatarEl.textContent = initials(fallback);
    });
    return main.querySelector('#pv-admin-content-slot');
  }
  PV.ui.montarLayoutAdmin = montarLayoutAdmin;

  function heading(title, subtitle, action = '') {
    return `<div class="pv-admin-page-heading ${action ? 'with-actions' : ''}"><div><span class="pv-admin-eyebrow">ADMINISTRAÇÃO</span><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${action}</div>`;
  }
  function toolbar(placeholder, addLabel = 'Adicionar', addId = 'pv-admin-add', withAdd = true) {
    return `<div class="pv-admin-toolbar"><label class="pv-admin-search">${svg('search')}<input class="pv-admin-search-input" id="pv-admin-search-input" type="search" placeholder="${esc(placeholder)}" autocomplete="off"></label><button type="button" class="pv-admin-filter-button" id="pv-admin-filter-button">${svg('filter')}<span>Filtros</span></button>${withAdd ? `<button type="button" class="pv-admin-primary-button" id="${addId}">${svg('plus')}<span>${esc(addLabel)}</span></button>` : ''}</div><div class="pv-admin-filter-panel" id="pv-admin-filter-panel" hidden></div><div id="pv-admin-alert" aria-live="polite"></div>`;
  }
  function tableStart(headers) {
    return `<div class="pv-admin-table-wrap"><table class="pv-admin-table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
  }
  function tableEnd() { return '</tbody></table></div>'; }
  function actionButton(action, id, label, iconName = 'edit') {
    return `<button type="button" class="pv-admin-row-action" data-${action}="${esc(id)}" aria-label="${esc(label)}" title="${esc(label)}">${svg(iconName)}</button>`;
  }
  function modalShell(id, title, body, saveLabel = 'Salvar') {
    return `<div class="pv-admin-modal-overlay" id="${id}" hidden><section class="pv-admin-modal" role="dialog" aria-modal="true" aria-labelledby="${id}-title"><header><h2 id="${id}-title">${esc(title)}</h2><button type="button" data-modal-close="${id}" aria-label="Fechar">×</button></header><div class="pv-admin-modal-body">${body}<div class="pv-admin-modal-error" id="${id}-error" aria-live="polite"></div></div><footer><button type="button" class="pv-admin-secondary-button" data-modal-close="${id}">Cancelar</button><button type="button" class="pv-admin-primary-button" id="${id}-save">${esc(saveLabel)}</button></footer></section></div>`;
  }
  function wireModalClose(root) {
    root.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => { const modal = root.querySelector('#' + button.dataset.modalClose); if (modal) modal.hidden = true; }));
    root.querySelectorAll('.pv-admin-modal-overlay').forEach((overlay) => overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.hidden = true; }));
  }
  function field(id, label, type = 'text', placeholder = '') {
    return `<label class="pv-admin-field" for="${id}"><span>${esc(label)}</span><input id="${id}" type="${type}" placeholder="${esc(placeholder)}"></label>`;
  }
  function setValue(root, id, value) { const el = root.querySelector('#' + id); if (el) el.value = value == null ? '' : String(value); }

  async function adminPacientes(main, ctx) {
    const slot = montarLayoutAdmin(main, 'patients', ctx);
    let items = [];
    let editing = null;
    slot.innerHTML = `${heading('Gestão de pacientes', 'Consulte e mantenha atualizados os cadastros dos pacientes.', `<button type="button" class="pv-admin-primary-button" id="pv-pacientes-add">${svg('plus')}<span>Adicionar</span></button>`)}${toolbar('Buscar por nome, e-mail ou cidade...', 'Adicionar', 'pv-pacientes-add-hidden', false)}<div id="pv-pacientes-table"></div>${modalShell('pv-pacientes-modal', 'Adicionar paciente', `<div class="pv-admin-form-grid">${field('p-nome', 'Nome completo *', 'text', 'Nome do paciente')}${field('p-nome-social', 'Nome social', 'text', 'Opcional')}${field('p-email', 'E-mail *', 'email', 'nome@exemplo.com')}${field('p-senha', 'Senha inicial *', 'password', 'Mínimo de 6 caracteres')}${field('p-celular', 'Celular', 'tel', 'DDD + número')}${field('p-cidade', 'Cidade', 'text', '')}${field('p-estado', 'Estado (UF)', 'text', 'Ex.: PR')}</div>`, 'Salvar paciente')}`;
    const listEl = slot.querySelector('#pv-pacientes-table');
    const modal = slot.querySelector('#pv-pacientes-modal');
    const search = slot.querySelector('#pv-admin-search-input');
    const filterButton = slot.querySelector('#pv-admin-filter-button');
    const filterPanel = slot.querySelector('#pv-admin-filter-panel');
    const addButton = slot.querySelector('#pv-pacientes-add');
    const saveButton = slot.querySelector('#pv-pacientes-modal-save');
    wireModalClose(slot);
    filterButton.addEventListener('click', () => {
      filterPanel.hidden = !filterPanel.hidden;
      filterPanel.innerHTML = `<label for="pv-pacientes-filter">Situação do cadastro</label><select id="pv-pacientes-filter"><option value="todos">Todos os cadastros</option><option value="completo">Com nome e e-mail</option><option value="pendente">Dados pendentes</option></select>`;
      filterPanel.querySelector('select').addEventListener('change', render);
    });
    function status(item) { return String(item.nome || item.nome_social || '').trim() && String(item.email || '').trim() ? 'Cadastrado' : 'Dados pendentes'; }
    function render() {
      const term = search.value.trim().toLocaleLowerCase('pt-BR');
      const filtro = filterPanel.querySelector('select')?.value || 'todos';
      const visible = items.filter((p) => `${p.nome || ''} ${p.nome_social || ''} ${p.email || ''} ${p.cidade || ''} ${p.estado || ''}`.toLocaleLowerCase('pt-BR').includes(term) && (filtro === 'todos' || (filtro === 'completo' ? status(p) === 'Cadastrado' : status(p) !== 'Cadastrado')));
      if (!visible.length) { listEl.innerHTML = '<div class="pv-admin-state">Nenhum paciente encontrado para essa busca.</div>'; return; }
      listEl.innerHTML = tableStart(['NOME', 'INFORMAÇÃO', 'STATUS', 'ATUALIZAÇÃO', '']) + visible.map((p) => `<tr><td><strong>${esc(p.nome_social || p.nome || 'Sem nome')}</strong></td><td>${esc(p.email || 'E-mail não informado')}${p.cidade ? `<small class="pv-admin-cell-subtitle">${esc(p.cidade)}${p.estado ? ' · ' + esc(p.estado) : ''}</small>` : ''}</td><td><span class="pv-admin-status ${status(p) === 'Cadastrado' ? 'is-good' : 'is-warning'}">${status(p)}</span></td><td>${esc(formatDate(p.updated_at || p.created_at))}</td><td>${actionButton('editar-paciente', p.id, 'Editar paciente')}</td></tr>`).join('') + tableEnd();
      listEl.querySelectorAll('[data-editar-paciente]').forEach((button) => button.addEventListener('click', () => abrir(items.find((p) => String(p.id) === button.dataset.editarPaciente))));
    }
    function abrir(item = null) {
      editing = item ? item.id : null;
      slot.querySelector('#pv-pacientes-modal-title').textContent = item ? 'Editar paciente' : 'Adicionar paciente';
      slot.querySelector('#pv-pacientes-modal-save').textContent = item ? 'Salvar alterações' : 'Salvar paciente';
      setValue(slot, 'p-nome', item?.nome || ''); setValue(slot, 'p-nome-social', item?.nome_social || ''); setValue(slot, 'p-email', item?.email || ''); setValue(slot, 'p-senha', ''); setValue(slot, 'p-celular', item?.celular || ''); setValue(slot, 'p-cidade', item?.cidade || ''); setValue(slot, 'p-estado', item?.estado || '');
      slot.querySelector('#pv-pacientes-modal-error').textContent = '';
      modal.hidden = false;
    }
    addButton.addEventListener('click', () => abrir());
    search.addEventListener('input', render);
    saveButton.addEventListener('click', async () => {
      const nome = slot.querySelector('#p-nome').value.trim();
      const email = slot.querySelector('#p-email').value.trim();
      const senha = slot.querySelector('#p-senha').value;
      const errorEl = slot.querySelector('#pv-pacientes-modal-error');
      if (!nome || !email || (!editing && !senha)) { errorEl.textContent = 'Preencha nome, e-mail e senha inicial para novos pacientes.'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = 'Informe um e-mail válido.'; return; }
      if (!editing && senha.length < 6) { errorEl.textContent = 'A senha inicial precisa ter ao menos 6 caracteres.'; return; }
      const data = { nome, nome_social: slot.querySelector('#p-nome-social').value.trim() || null, email, celular: slot.querySelector('#p-celular').value.trim() || null, cidade: slot.querySelector('#p-cidade').value.trim() || null, estado: slot.querySelector('#p-estado').value.trim().toUpperCase() || null };
      if (senha) data.senha = senha;
      saveButton.disabled = true;
      saveButton.textContent = 'Salvando...';
      try {
        if (editing) await PV.db.pacientes.atualizar(editing, data);
        else await PV.db.pacientes.criar(data);
        modal.hidden = true;
        notify(slot.querySelector('#pv-admin-alert'), editing ? 'Cadastro atualizado.' : 'Paciente cadastrado.', 'success');
        items = await PV.db.pacientes.listar(); render();
      } catch (error) { errorEl.textContent = error.message || 'Não foi possível salvar o paciente.'; }
      finally { saveButton.disabled = false; saveButton.textContent = editing ? 'Salvar alterações' : 'Salvar paciente'; }
    });
    setLoading(listEl);
    try { items = await PV.db.pacientes.listar(); render(); }
    catch (error) { listEl.innerHTML = `<div class="pv-admin-state pv-admin-state-error">${esc(error.message || 'Não foi possível carregar os pacientes.')} <button type="button" id="pv-pacientes-retry">Tentar novamente</button></div>`; listEl.querySelector('#pv-pacientes-retry').addEventListener('click', async () => { setLoading(listEl); try { items = await PV.db.pacientes.listar(); render(); } catch (e) { notify(slot.querySelector('#pv-admin-alert'), e.message || 'Falha ao carregar pacientes.'); } }); }
  }

  async function adminRegistros(main, ctx) {
    const slot = montarLayoutAdmin(main, 'records', ctx);
    let registros = [], sintomas = [], pacientes = [];
    let detalheAtual = null;
    slot.innerHTML = `${heading('Visualização de registros', 'Consulte os registros de intensidade informados pelos pacientes.', `<button type="button" class="pv-admin-primary-button" id="pv-registros-add">${svg('plus')}<span>Adicionar</span></button>`)}${toolbar('Buscar por sintoma, paciente ou código...', 'Adicionar', 'pv-registros-add-hidden', false)}<div id="pv-registros-table"></div>${modalShell('pv-registros-add-modal', 'Novo registro de intensidade', `<div class="pv-admin-form-grid"><label class="pv-admin-field"><span>Paciente *</span><select id="r-paciente"></select></label><label class="pv-admin-field"><span>Sintoma *</span><select id="r-sintoma"></select></label><label class="pv-admin-field"><span>Intensidade (0 a 10) *</span><select id="r-intensidade">${Array.from({length:11},(_,n)=>`<option value="${n}">${n}</option>`).join('')}</select></label></div><p class="pv-admin-modal-note">Esse registro será salvo como uma informação inserida pela administração para o paciente selecionado.</p>`, 'Salvar registro')}${modalShell('pv-registros-detail-modal', 'Detalhes do registro', '<div id="pv-registro-detail-body"></div>', 'Fechar')}`;
    const listEl = slot.querySelector('#pv-registros-table');
    const search = slot.querySelector('#pv-admin-search-input');
    const filterPanel = slot.querySelector('#pv-admin-filter-panel');
    const addModal = slot.querySelector('#pv-registros-add-modal');
    const detailModal = slot.querySelector('#pv-registros-detail-modal');
    const addButton = slot.querySelector('#pv-registros-add');
    const saveButton = slot.querySelector('#pv-registros-add-modal-save');
    wireModalClose(slot);
    const patientById = () => new Map(pacientes.map((p) => [Number(p.id), p]));
    const symptomById = () => new Map(sintomas.map((s) => [Number(s.id), s]));
    slot.querySelector('#pv-admin-filter-button').addEventListener('click', () => {
      filterPanel.hidden = !filterPanel.hidden;
      filterPanel.innerHTML = `<label for="pv-registros-filter">Intensidade</label><select id="pv-registros-filter"><option value="todos">Todos os níveis</option>${Array.from({length:11},(_,n)=>`<option value="${n}">Nível ${n}</option>`).join('')}</select>`;
      filterPanel.querySelector('select').addEventListener('change', render);
    });
    function render() {
      const mapP = patientById(), mapS = symptomById();
      const term = search.value.trim().toLocaleLowerCase('pt-BR');
      const filter = filterPanel.querySelector('select')?.value || 'todos';
      const visible = registros.filter((r) => {
        const p = mapP.get(Number(r.paciente_id)); const s = mapS.get(Number(r.sintoma_id));
        const patientName = p?.nome_social || p?.nome || `Paciente #${r.paciente_id}`;
        const symptomName = s?.nome_sintoma || `Sintoma #${r.sintoma_id}`;
        return `${patientName} ${symptomName} ${r.paciente_id} ${r.intensidade}`.toLocaleLowerCase('pt-BR').includes(term) && (filter === 'todos' || String(r.intensidade) === filter);
      });
      if (!visible.length) { listEl.innerHTML = '<div class="pv-admin-state">Nenhum registro encontrado.</div>'; return; }
      listEl.innerHTML = tableStart(['NOME', 'INFORMAÇÃO', 'STATUS', 'ATUALIZAÇÃO', '']) + visible.map((r) => {
        const p = mapP.get(Number(r.paciente_id)); const s = mapS.get(Number(r.sintoma_id));
        return `<tr><td><strong>${esc(s?.nome_sintoma || `Sintoma #${r.sintoma_id}`)}</strong></td><td>${esc(p?.nome_social || p?.nome || `Paciente #${r.paciente_id}`)}<small class="pv-admin-cell-subtitle">Código ${esc(r.paciente_id)}</small></td><td><span class="pv-admin-status is-good">Nível ${esc(r.intensidade ?? '—')}</span></td><td>${esc(formatDate(r.data_registro, true))}</td><td>${actionButton('ver-registro', r.id, 'Ver registro', 'eye')}</td></tr>`;
      }).join('') + tableEnd();
      listEl.querySelectorAll('[data-ver-registro]').forEach((button) => button.addEventListener('click', () => abrirDetalhe(registros.find((r) => String(r.id) === button.dataset.verRegistro))));
    }
    function abrirDetalhe(r) {
      if (!r) return;
      const p = patientById().get(Number(r.paciente_id)); const s = symptomById().get(Number(r.sintoma_id));
      slot.querySelector('#pv-registro-detail-body').innerHTML = `<dl class="pv-admin-detail-list"><div><dt>Paciente</dt><dd>${esc(p?.nome_social || p?.nome || `Paciente #${r.paciente_id}`)}</dd></div><div><dt>Sintoma</dt><dd>${esc(s?.nome_sintoma || `Sintoma #${r.sintoma_id}`)}</dd></div><div><dt>Intensidade registrada</dt><dd><strong class="pv-admin-detail-level">${esc(r.intensidade)}/10</strong></dd></div><div><dt>Data e hora</dt><dd>${esc(r.data_registro ? new Date(r.data_registro).toLocaleString('pt-BR') : '—')}</dd></div></dl>`;
      slot.querySelector('#pv-registros-detail-modal-title').textContent = 'Detalhes do registro';
      slot.querySelector('#pv-registros-detail-modal-save').textContent = 'Fechar';
      slot.querySelector('#pv-registros-detail-modal-save').onclick = () => { detailModal.hidden = true; };
      detailModal.hidden = false;
    }
    function abrirNovo() {
      const selectP = slot.querySelector('#r-paciente'); const selectS = slot.querySelector('#r-sintoma');
      selectP.innerHTML = pacientes.map((p) => `<option value="${esc(p.id)}">${esc(p.nome_social || p.nome || `Paciente #${p.id}`)} · #${esc(p.id)}</option>`).join('');
      selectS.innerHTML = sintomas.map((s) => `<option value="${esc(s.id)}">${esc(s.nome_sintoma)}</option>`).join('');
      slot.querySelector('#pv-registros-add-modal-error').textContent = '';
      addModal.hidden = false;
    }
    addButton.addEventListener('click', abrirNovo);
    search.addEventListener('input', render);
    saveButton.addEventListener('click', async () => {
      const pacienteId = Number(slot.querySelector('#r-paciente').value); const sintomaId = Number(slot.querySelector('#r-sintoma').value); const intensidade = Number(slot.querySelector('#r-intensidade').value);
      const errorEl = slot.querySelector('#pv-registros-add-modal-error');
      if (!pacienteId || !sintomaId) { errorEl.textContent = 'Cadastre pelo menos um paciente e um sintoma antes de registrar.'; return; }
      saveButton.disabled = true; saveButton.textContent = 'Salvando...';
      try { await PV.db.registros.criar({ paciente_id: pacienteId, sintoma_id: sintomaId, intensidade }); addModal.hidden = true; notify(slot.querySelector('#pv-admin-alert'), 'Registro salvo.', 'success'); registros = await PV.db.registros.listar(); render(); }
      catch (error) { errorEl.textContent = error.message || 'Não foi possível salvar o registro.'; }
      finally { saveButton.disabled = false; saveButton.textContent = 'Salvar registro'; }
    });
    setLoading(listEl);
    try { [registros, sintomas, pacientes] = await Promise.all([PV.db.registros.listar(), PV.db.sintomas.listar(), PV.db.pacientes.listar()]); registros.sort((a,b)=>new Date(b.data_registro)-new Date(a.data_registro)); render(); }
    catch (error) { listEl.innerHTML = `<div class="pv-admin-state pv-admin-state-error">${esc(error.message || 'Não foi possível carregar os registros.')}</div>`; }
  }

  async function adminSintomas(main, ctx) {
    const slot = montarLayoutAdmin(main, 'symptoms', ctx);
    let sintomas = [], registros = [], editing = null;
    slot.innerHTML = `${heading('Gestão de sintomas', 'Gerencie os sintomas disponíveis para registro pelos pacientes.', `<button type="button" class="pv-admin-primary-button" id="pv-sintomas-add">${svg('plus')}<span>Adicionar</span></button>`)}${toolbar('Buscar por nome do sintoma...', 'Adicionar', 'pv-sintomas-add-hidden', false)}<div id="pv-sintomas-table"></div>${modalShell('pv-sintomas-modal', 'Adicionar sintoma', field('s-nome', 'Nome do sintoma *', 'text', 'Digite o nome'), 'Salvar sintoma')}`;
    const listEl = slot.querySelector('#pv-sintomas-table'); const search = slot.querySelector('#pv-admin-search-input'); const filterPanel = slot.querySelector('#pv-admin-filter-panel'); const modal = slot.querySelector('#pv-sintomas-modal'); const addButton = slot.querySelector('#pv-sintomas-add'); const saveButton = slot.querySelector('#pv-sintomas-modal-save');
    wireModalClose(slot);
    slot.querySelector('#pv-admin-filter-button').addEventListener('click', () => { filterPanel.hidden = !filterPanel.hidden; filterPanel.innerHTML = '<label for="pv-sintomas-filter">Histórico</label><select id="pv-sintomas-filter"><option value="todos">Todos</option><option value="registrados">Com registros</option><option value="sem-registros">Sem registros</option></select>'; filterPanel.querySelector('select').addEventListener('change', render); });
    function render() {
      const term = search.value.trim().toLocaleLowerCase('pt-BR'); const filtro = filterPanel.querySelector('select')?.value || 'todos';
      const count = new Map(); const last = new Map();
      registros.forEach((r) => { const id = Number(r.sintoma_id); count.set(id, (count.get(id) || 0) + 1); const prior = last.get(id); if (!prior || new Date(r.data_registro) > new Date(prior)) last.set(id, r.data_registro); });
      const visible = sintomas.filter((s) => String(s.nome_sintoma || '').toLocaleLowerCase('pt-BR').includes(term) && (filtro === 'todos' || (filtro === 'registrados' ? (count.get(Number(s.id)) || 0) > 0 : (count.get(Number(s.id)) || 0) === 0)));
      if (!visible.length) { listEl.innerHTML = '<div class="pv-admin-state">Nenhum sintoma encontrado.</div>'; return; }
      listEl.innerHTML = tableStart(['NOME', 'INFORMAÇÃO', 'STATUS', 'ATUALIZAÇÃO', '']) + visible.map((s) => `<tr><td><strong>${esc(s.nome_sintoma)}</strong></td><td>${(count.get(Number(s.id)) || 0).toLocaleString('pt-BR')} ${(count.get(Number(s.id)) || 0) === 1 ? 'registro' : 'registros'}</td><td><span class="pv-admin-status is-good">Cadastrado</span></td><td>${esc(formatDate(last.get(Number(s.id))))}</td><td><div class="pv-admin-row-actions">${actionButton('editar-sintoma', s.id, 'Editar sintoma')}${actionButton('excluir-sintoma', s.id, 'Remover sintoma', 'trash')}</div></td></tr>`).join('') + tableEnd();
      listEl.querySelectorAll('[data-editar-sintoma]').forEach((button) => button.addEventListener('click', () => abrir(sintomas.find((s) => String(s.id) === button.dataset.editarSintoma))));
      listEl.querySelectorAll('[data-excluir-sintoma]').forEach((button) => button.addEventListener('click', async () => {
        const item = sintomas.find((s) => String(s.id) === button.dataset.excluirSintoma); if (!item) return;
        if (!confirm(`Remover o sintoma “${item.nome_sintoma}” da lista? Registros históricos existentes não serão apagados automaticamente.`)) return;
        try { await PV.db.sintomas.remover(item.id); sintomas = await PV.db.sintomas.listar(); render(); notify(slot.querySelector('#pv-admin-alert'), 'Sintoma removido da lista.', 'success'); }
        catch (error) { notify(slot.querySelector('#pv-admin-alert'), error.message || 'Não foi possível remover o sintoma.'); }
      }));
    }
    function abrir(item = null) { editing = item ? item.id : null; slot.querySelector('#pv-sintomas-modal-title').textContent = item ? 'Editar sintoma' : 'Adicionar sintoma'; saveButton.textContent = item ? 'Salvar alterações' : 'Salvar sintoma'; setValue(slot, 's-nome', item?.nome_sintoma || ''); slot.querySelector('#pv-sintomas-modal-error').textContent = ''; modal.hidden = false; }
    addButton.addEventListener('click', () => abrir()); search.addEventListener('input', render);
    saveButton.addEventListener('click', async () => { const nome = slot.querySelector('#s-nome').value.trim(); const errorEl = slot.querySelector('#pv-sintomas-modal-error'); if (!nome) { errorEl.textContent = 'Informe o nome do sintoma.'; return; } saveButton.disabled = true; saveButton.textContent = 'Salvando...'; try { if (editing) await PV.db.sintomas.atualizar(editing, nome); else await PV.db.sintomas.criar(nome); sintomas = await PV.db.sintomas.listar(); modal.hidden = true; render(); notify(slot.querySelector('#pv-admin-alert'), editing ? 'Sintoma atualizado.' : 'Sintoma cadastrado.', 'success'); } catch (error) { errorEl.textContent = error.message || 'Não foi possível salvar o sintoma.'; } finally { saveButton.disabled = false; saveButton.textContent = editing ? 'Salvar alterações' : 'Salvar sintoma'; } });
    setLoading(listEl);
    try { [sintomas, registros] = await Promise.all([PV.db.sintomas.listar(), PV.db.registros.listar()]); render(); }
    catch (error) { listEl.innerHTML = `<div class="pv-admin-state pv-admin-state-error">${esc(error.message || 'Não foi possível carregar os sintomas.')}</div>`; }
  }

  PV.screens.adminPacientes = adminPacientes;
  PV.screens.adminRegistros = adminRegistros;
  PV.screens.adminSintomas = adminSintomas;
})();
