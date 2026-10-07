/**
 * Peças de UI compartilhadas — porta de components/Header.tsx, Footer.tsx,
 * Aviso.tsx, Chips.tsx e do tabBar montado em navigation/RootNavigator.tsx.
 *
 * Cada função devolve uma string HTML (para usar com innerHTML) e, quando
 * tem interação, uma função `ligar(root)` para conectar os event listeners
 * depois que o HTML entrou no DOM — o mesmo padrão em todas as telas.
 */
window.PV = window.PV || {};

(function () {
  function escaparHtml(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  /* Ícones que existiam como PNG corrompido no bundle original (LogoClara.png
     e lupa.png) foram refeitos aqui como SVG simples, no mesmo espírito
     minimalista do resto do app — ver nota no README do site. Mantidos para
     uso pontual em telas específicas; o cabeçalho global agora usa o logo
     fornecido em assets/img/logo-*.png (ver header()/headerLogin() abaixo). */
  function svgLogo() {
    return `
      <svg viewBox="0 0 90 100" width="72" height="80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M45 92C45 92 12 68 12 40C12 22 25 10 40 10C42 10 44 10.6 45 12C46 10.6 48 10 50 10C65 10 78 22 78 40C78 68 45 92 45 92Z"
          fill="none" stroke="#112A6C" stroke-width="5" stroke-linejoin="round"/>
        <path d="M22 42L34 42L40 30L48 54L54 42L66 42" fill="none" stroke="#E78F47" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  function svgLupa() {
    return `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="#112A6C" stroke-width="2.2"/>
        <line x1="15.4" y1="15.4" x2="21" y2="21" stroke="#112A6C" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;
  }

  /* Ícone de microfone minimalista (traço simples, sem preenchimento), no
     mesmo espírito visual do restante do app — substitui o emoji 🎤 usado
     antes na busca por voz da Triagem. */
  function svgMic(gravando) {
    const cor = gravando ? '#FFFFFF' : 'currentColor';
    return `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="9" y="2.5" width="6" height="11" rx="3" stroke="${cor}" stroke-width="1.8"/>
        <path d="M5.5 11.5a6.5 6.5 0 0013 0" stroke="${cor}" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="12" y1="18" x2="12" y2="21.5" stroke="${cor}" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="8" y1="21.5" x2="16" y2="21.5" stroke="${cor}" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
  }

  /* Ícone discreto de "relatório do dia" (prancheta com lista) — traço fino,
     sem preenchimento, no mesmo espírito minimalista dos demais ícones do
     app. Usado no canto da tela de Menu de Sintomas para abrir o painel com
     os sintomas já registrados hoje. */
  function svgRelatorio() {
    return `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.7"/>
        <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.7"/>
        <path d="M9 11h6M9 15h6M9 19h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>`;
  }

  /* ======================================================== Header.tsx ===
     O cabeçalho agora é global: ele é montado uma única vez pelo roteador
     dentro de #app-header (fora da área rolável de #app-main), então ele
     fica sempre visível e nunca precisa ser incluído no HTML de cada tela.

     - headerLogin(): usado só na tela de login — logo + nome "PaliVida"
       lado a lado, SEM a tarja azul de fundo, conforme o material de marca
       fornecido (assets/img/logo-completo.png).
     - header(): usado em todas as outras telas (autenticadas) — mostra
       apenas o ícone/logo da marca, sem o nome por extenso e sem tarja,
       ancorado no canto superior esquerdo. */
  function headerLogin() {
    return `<div class="pv-header pv-header--login"><img class="pv-logo-completo" src="assets/img/logo-completo.png" alt="PaliVida"></div>`;
  }

  function header() {
    return `<div class="pv-header"><img class="pv-logo-icone" src="assets/img/logo-icone.png" alt="PaliVida">${controleTema()}<button type="button" class="pv-logout-button" data-sair aria-label="Sair da conta"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span>Sair</span></button></div>`;
  }

  function controleTema(extraClass = '') {
    const dark = document.documentElement.classList.contains('pv-dark-mode');
    const action = dark ? 'Desativar modo escuro' : 'Ativar modo escuro';
    const label = dark ? 'Modo claro' : 'Modo escuro';
    return `<button type="button" class="pv-theme-toggle ${extraClass}" data-theme-toggle aria-label="${action}" aria-pressed="${dark}" title="${action}">
      <svg class="pv-theme-icon pv-theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg>
      <svg class="pv-theme-icon pv-theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
      <span data-theme-label>${label}</span>
    </button>`;
  }

  function sincronizarControleTema() {
    const dark = document.documentElement.classList.contains('pv-dark-mode');
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const label = dark ? 'Modo claro' : 'Modo escuro';
      const action = dark ? 'Desativar modo escuro' : 'Ativar modo escuro';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', action);
      button.setAttribute('title', action);
      const text = button.querySelector('[data-theme-label]');
      if (text) text.textContent = label;
    });
  }

  /* ======================================================== Footer.tsx ===
     O elemento <footer id="app-footer"> já existe fixo em index.html, fora
     da área rolável — footerConteudo() só devolve o HTML de dentro dele
     (os 3 ou 4 botões de atalho), e marca como "ativo" o atalho da rota
     atual (mesmo papel que a antiga tabbar() tinha). */
  const ATALHOS_FOOTER = [
    { id: 'home', rotulo: 'Início', img: 'assets/img/Home.png' },
    { id: 'busca', rotulo: 'Entendendo os sintomas', img: 'assets/img/Question.png' },
    { id: 'perfil', rotulo: 'Prontuário', img: 'assets/img/User.png' },
  ];

  // Aba de Triagem (busca de sintomas + prontuário/carteirinha + laudo) só
  // aparece para quem tem prontuário de paciente (paciente e cuidador). Para
  // esses dois perfis ela cobre o mesmo propósito da antiga aba "Entendendo
  // os sintomas" (ícone de interrogação), que por isso é removida do menu
  // deles — a rota /busca continua existindo só para o administrador, que
  // a usa para gerenciar conteúdos e não tem acesso à Triagem.
  const ATALHO_TRIAGEM = { id: 'triagem', rotulo: 'Triagem e Prontuário', img: 'assets/img/triagem.png' };

  function atalhosPara(tipoUsuario) {
    if (tipoUsuario === 'administrador') return ATALHOS_FOOTER;
    const [inicio, , perfil] = ATALHOS_FOOTER;
    return [inicio, ATALHO_TRIAGEM, perfil];
  }

  function footerConteudo(tipoUsuario, rotaAtiva) {
    return atalhosPara(tipoUsuario).map(
      (a) => `<button type="button" class="${a.id === rotaAtiva ? 'ativo' : ''}" data-ir="${a.id}" aria-label="${a.rotulo}"><img src="${a.img}" alt=""></button>`,
    ).join('');
  }

  /* Mantidas por compatibilidade com qualquer código antigo que ainda
     referencie footer()/tabbar() diretamente — devolvem o mesmo miolo que
     footerConteudo(), já que o <footer> agora é montado pelo roteador. */
  function footer(tipoUsuario) {
    return footerConteudo(tipoUsuario, null);
  }
  function tabbar(rotaAtiva, tipoUsuario) {
    return footerConteudo(tipoUsuario, rotaAtiva);
  }

  /** Liga os botões de Footer/tabbar (mesmo atributo data-ir) a navegação por hash. */
  function ligarNavegacaoInferior(root) {
    root.querySelectorAll('[data-ir]').forEach((btn) => {
      btn.addEventListener('click', () => PV.router.navegar('/' + btn.dataset.ir));
    });
  }

  function ligarLogout(root) {
    root.querySelectorAll('[data-sair]').forEach((btn) => {
      btn.addEventListener('click', () => {
        PV.session.limparSessao();
        PV.router.navegar('/login');
      });
    });
  }

  function montarLayoutPaciente(main, rotaAtiva) {
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-dashboard-shell-main');
    const secaoAtiva = ['triagem', 'menu-sintomas', 'conteudo', 'definicao', 'sinal'].includes(rotaAtiva)
      ? 'triagem'
      : rotaAtiva;
    main.innerHTML = `
      <div class="pv-dashboard-shell pv-dashboard-paciente">
        <aside class="pv-dash-sidebar" aria-label="Navegação principal">
          <a class="pv-dash-brand" href="#/home" aria-label="PaliVida — início">
            <img src="assets/img/logo-completo.png" alt="PaliVida">
          </a>
          <nav class="pv-dash-nav">
            <button type="button" data-rota="/home" class="${secaoAtiva === 'home' ? 'ativo' : ''}" ${secaoAtiva === 'home' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg><span>Início</span>
            </button>
            <button type="button" data-rota="/triagem" class="${secaoAtiva === 'triagem' ? 'ativo' : ''}" ${secaoAtiva === 'triagem' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 9h8M8 13h8M8 17h5"/></svg><span>Triagem</span>
            </button>
            <button type="button" data-rota="/perfil" class="${secaoAtiva === 'perfil' ? 'ativo' : ''}" ${secaoAtiva === 'perfil' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span>Prontuário</span>
            </button>
          </nav>
          <div class="pv-dash-sidebar-note">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
            <span>Cuidar também<br>é qualidade de vida.</span>
          </div>
        </aside>
        <section class="pv-dash-workspace">
          <header class="pv-dash-topbar">
            <div class="pv-dash-topbar-spacer"></div>
            ${controleTema()}
            <button class="pv-logout-button pv-logout-button--dashboard" type="button" data-sair aria-label="Sair da conta">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span>Sair</span>
            </button>
          </header>
          <div class="pv-dash-content pv-dash-page-content"></div>
        </section>
      </div>`;

    main.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });
    ligarLogout(main);
    return main.querySelector('.pv-dash-page-content');
  }

  function montarLayoutAdministrador(main, rotaAtiva, usuario) {
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-dashboard-shell-main');
    const nome = usuario.nome || usuario.nome_completo || usuario.email || 'Administrador';
    const nav = [
      { rota: 'home', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>' },
      { rota: 'busca', label: 'Conteúdos', icon: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 1 4 16.5z"/><path d="M4 16a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8m-8 4h6"/>' },
      { rota: 'perfil', label: 'Meu perfil', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' },
    ];

    main.innerHTML = `
      <div class="pv-dashboard-shell pv-dashboard-admin">
        <aside class="pv-dash-sidebar" aria-label="Navegação administrativa">
          <a class="pv-dash-brand" href="#/home" aria-label="PaliVida — dashboard">
            <img src="assets/img/logo-completo.png" alt="PaliVida">
          </a>
          <span class="pv-admin-sidebar-label">ADMINISTRAÇÃO</span>
          <nav class="pv-dash-nav">
            ${nav.map((item) => `
              <button type="button" data-rota="/${item.rota}" class="${rotaAtiva === item.rota ? 'ativo' : ''}" ${rotaAtiva === item.rota ? 'aria-current="page"' : ''}>
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
                <span>${item.label}</span>
              </button>`).join('')}
          </nav>
          <div class="pv-dash-sidebar-note">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
            <span>Cuidar também<br>é qualidade de vida.</span>
          </div>
        </aside>
        <section class="pv-dash-workspace">
          <header class="pv-dash-topbar pv-admin-topbar">
            <div class="pv-dash-topbar-spacer"></div>
            ${controleTema()}
            <div class="pv-admin-role-badge"><span aria-hidden="true"></span> Administrador</div>
            <button class="pv-logout-button pv-logout-button--dashboard" type="button" data-sair aria-label="Sair da conta">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span>Sair</span>
            </button>
            <button class="pv-dash-profile" type="button" aria-label="Abrir meu perfil" data-rota="/perfil">
              <span class="pv-dash-avatar">${iconeInicial(nome)}</span>
              <span class="pv-dash-profile-copy"><strong>${escaparHtml(nome)}</strong><small>Administrador</small></span>
              <span class="pv-dash-chevron" aria-hidden="true">⌄</span>
            </button>
          </header>
          <div class="pv-dash-content pv-dash-page-content pv-admin-page-content" id="pv-admin-page-content"></div>
        </section>
      </div>`;

    const shell = main.querySelector('.pv-dashboard-admin');
    ligarLogout(shell);
    shell.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });
    return shell.querySelector('#pv-admin-page-content');
  }

  function montarLayoutCuidador(main, rotaAtiva, usuario) {
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-dashboard-shell-main');
    const nome = usuario.nome_completo || usuario.nome_social || 'Cuidador';
    const secaoAtiva = ['triagem', 'menu-sintomas', 'laudo', 'conteudo', 'definicao', 'sinal'].includes(rotaAtiva)
      ? 'triagem'
      : rotaAtiva;
    const nav = [
      { rota: 'home', label: 'Início', icon: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
      { rota: 'triagem', label: 'Triagem', icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 9h8M8 13h8M8 17h5"/>' },
      { rota: 'perfil', label: 'Meu perfil', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' },
    ];

    main.innerHTML = `
      <div class="pv-dashboard-shell pv-dashboard-cuidador">
        <aside class="pv-dash-sidebar" aria-label="Navegação do cuidador">
          <a class="pv-dash-brand" href="#/home" aria-label="PaliVida — início">
            <img src="assets/img/logo-completo.png" alt="PaliVida">
          </a>
          <nav class="pv-dash-nav">
            ${nav.map((item) => `
              <button type="button" data-rota="/${item.rota}" class="${secaoAtiva === item.rota ? 'ativo' : ''}" ${secaoAtiva === item.rota ? 'aria-current="page"' : ''}>
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
                <span>${item.label}</span>
              </button>`).join('')}
          </nav>
          <div class="pv-dash-sidebar-note">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
            <span>Cuidar também<br>é qualidade de vida.</span>
          </div>
        </aside>
        <section class="pv-dash-workspace">
          <header class="pv-dash-topbar pv-caregiver-topbar">
            <div class="pv-dash-topbar-spacer"></div>
            ${controleTema()}
            <div class="pv-caregiver-role-badge"><span aria-hidden="true"></span> Cuidador</div>
            <button class="pv-logout-button pv-logout-button--dashboard" type="button" data-sair aria-label="Sair da conta">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span>Sair</span>
            </button>
            <button class="pv-dash-profile" type="button" aria-label="Abrir meu perfil" data-rota="/perfil">
              <span class="pv-dash-avatar">${iconeInicial(nome)}</span>
              <span class="pv-dash-profile-copy"><strong id="pv-caregiver-profile-name">${escaparHtml(nome)}</strong><small>Cuidador</small></span>
              <span class="pv-dash-chevron" aria-hidden="true">⌄</span>
            </button>
          </header>
          <div class="pv-dash-content pv-dash-page-content pv-caregiver-page-content" id="pv-caregiver-page-content"></div>
        </section>
      </div>`;

    const shell = main.querySelector('.pv-dashboard-cuidador');
    ligarLogout(shell);
    shell.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });
    return shell.querySelector('#pv-caregiver-page-content');
  }

  function iconeInicial(nome) {
    const inicial = String(nome || 'A').trim().charAt(0).toLocaleUpperCase('pt-BR');
    return escaparHtml(inicial || 'A');
  }

  /* ========================================================= Aviso.tsx === */
  function aviso(mensagem) {
    if (!mensagem) return '';
    const classe = mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro';
    return `<div class="pv-aviso ${classe}" role="alert">${escaparHtml(mensagem.texto)}</div>`;
  }

  function spinner(claro) {
    return `<div class="pv-spinner${claro ? ' claro' : ''}"></div>`;
  }

  function carregando(texto, claro) {
    return `<div class="pv-carregando">${spinner(claro)}${texto ? `<span>${escaparHtml(texto)}</span>` : ''}</div>`;
  }

  /* =============================================================== Chips === */
  const GENEROS = ['Feminino', 'Masculino', 'Não-binário', 'Outro', 'Prefiro não informar'];
  const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  function chips(grupo, opcoes, selecionado) {
    return `<div class="pv-chips" data-grupo="${grupo}" role="radiogroup">${opcoes
      .map(
        (op) =>
          `<button type="button" class="pv-chip${op === selecionado ? ' ativo' : ''}" role="radio" aria-checked="${op === selecionado}" data-valor="${escaparHtml(op)}">${escaparHtml(op)}</button>`,
      )
      .join('')}</div>`;
  }

  /** Liga um grupo de chips: clique seleciona e chama onSelecionar(valor). */
  function ligarChips(root, grupo, onSelecionar) {
    const wrap = root.querySelector(`.pv-chips[data-grupo="${grupo}"]`);
    if (!wrap) return;
    wrap.querySelectorAll('.pv-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.pv-chip').forEach((b) => {
          b.classList.remove('ativo');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('ativo');
        btn.setAttribute('aria-checked', 'true');
        onSelecionar(btn.dataset.valor);
      });
    });
  }

  function selectOpcoes(opcoes, selecionado, placeholder) {
    const ph = placeholder ? `<option value="">${escaparHtml(placeholder)}</option>` : '';
    return ph + opcoes
      .map((op) => `<option value="${escaparHtml(op)}" ${op === selecionado ? 'selected' : ''}>${escaparHtml(op)}</option>`)
      .join('');
  }

  window.PV.ui = {
    escaparHtml,
    svgLogo,
    svgLupa,
    svgMic,
    svgRelatorio,
    header,
    headerLogin,
    controleTema,
    sincronizarControleTema,
    footer,
    footerConteudo,
    tabbar,
    ligarNavegacaoInferior,
    montarLayoutPaciente,
    montarLayoutAdministrador,
    montarLayoutCuidador,
    ligarLogout,
    aviso,
    spinner,
    carregando,
    chips,
    ligarChips,
    selectOpcoes,
    GENEROS,
    TIPOS_SANGUINEOS,
    UFS,
  };
})();
