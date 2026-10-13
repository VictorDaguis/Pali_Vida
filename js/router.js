/**
 * Roteador por hash — porta de navigation/RootNavigator.tsx.
 *
 * Um site estático não tem servidor para rotear URLs "de verdade" (algo como
 * /conteudo/3 exigiria configurar rewrites no host), então cada "tela" vira
 * uma rota por hash (#/conteudo/3). O guard de autenticação e a regra de
 * "administrador vê o Dashboard no lugar da Home" espelham exatamente o que
 * RootNavigator.tsx faz.
 *
 * Cabeçalho e rodapé (com os 3 atalhos de navegação) são montados aqui, uma
 * única vez por navegação, dentro de #app-header/#app-footer — que ficam
 * FORA da área rolável (#app-main). Isso garante que os 3 elementos do
 * rodapé fiquem sempre visíveis, em qualquer tela, sem serem empurrados
 * para fora da viewport por conteúdo longo. As telas em si (js/screens/*)
 * não precisam mais montar header()/footer() — só o conteúdo próprio.
 */
window.PV = window.PV || {};

(function () {
  const PUBLICAS = new Set(['login', 'cadastro']);
  let geracaoAtual = 0;

  function analisar() {
    let hash = location.hash.slice(1);
    if (!hash) hash = '/login';
    const [caminho, queryStr] = hash.split('?');
    const partes = caminho.split('/').filter(Boolean);
    const query = Object.fromEntries(new URLSearchParams(queryStr || ''));
    return { rota: (partes[0] || 'login').toLowerCase(), sub: partes[1], query };
  }

  async function renderizar() {
    const minhaGeracao = ++geracaoAtual;
    const { rota, sub, query } = analisar();
    const sessao = PV.session.lerSessao();

    if (!sessao && !PUBLICAS.has(rota)) {
      location.hash = '#/login';
      return;
    }

    const main = document.getElementById('app-main');
    const headerEl = document.getElementById('app-header');
    const footerEl = document.getElementById('app-footer');
    const painelPaciente = Boolean(
      sessao &&
      sessao.usuario.tipo === 'paciente' &&
      ['home', 'triagem', 'perfil', 'meu-perfil', 'contato'].includes(rota),
    );
    const painelAdministrador = Boolean(
      sessao &&
      sessao.usuario.tipo === 'administrador' &&
      ['home', 'busca', 'admin-pacientes', 'admin-registros', 'admin-sintomas', 'admin-conteudos'].includes(rota),
    );
    document.body.classList.toggle('pv-route-login', rota === 'login' || rota === 'cadastro');
    document.body.classList.toggle('pv-route-home', rota === 'home' || (rota === 'contato' && Boolean(sessao && sessao.usuario.tipo === 'paciente')));
    document.body.classList.toggle('pv-role-paciente', Boolean(sessao && sessao.usuario.tipo === 'paciente'));
    document.body.classList.toggle('pv-role-acompanhante', Boolean(sessao && sessao.usuario.tipo === 'acompanhante'));
    document.body.classList.toggle('pv-role-administrador', Boolean(sessao && sessao.usuario.tipo === 'administrador'));
    document.body.classList.toggle('pv-paciente-dashboard', painelPaciente);
    document.body.classList.toggle('pv-admin-dashboard', painelAdministrador);
    document.querySelector('.app-shell').classList.toggle('pv-paciente-dashboard', painelPaciente);
    document.querySelector('.app-shell').classList.toggle('pv-admin-dashboard', painelAdministrador);
    main.innerHTML = '';
    main.classList.remove('pv-dashboard-paciente-main');
    main.classList.remove('pv-menu-sintomas-main', 'pv-conteudo-detalhe-main', 'pv-sintoma-detalhe-main', 'pv-sintoma-registro-main', 'pv-cuidador-vinculos-main', 'pv-cuidador-sintomas-main', 'pv-laudo-modern-main');
    // Reseta a marcação de "tela sem rolagem" a cada navegação; a própria
    // tela (ex.: menuSintomas) adiciona a classe de volta se precisar.
    main.classList.remove('pv-sem-scroll');

    const ctx = { sub, query, sessao, usuario: sessao ? sessao.usuario : null };

    // O painel de paciente desenha sua própria navegação lateral; as telas
    // públicas também não usam o cabeçalho e o rodapé autenticados.
    if (PUBLICAS.has(rota) || painelPaciente || painelAdministrador || (sessao && sessao.usuario.tipo === 'acompanhante' && ['vinculos', 'sintomas'].includes(rota))) {
      headerEl.hidden = true;
      footerEl.hidden = true;
      headerEl.innerHTML = '';
      footerEl.innerHTML = '';
    } else {
      headerEl.hidden = false;
      headerEl.innerHTML = PV.ui.header();
      footerEl.hidden = false;
      footerEl.innerHTML = PV.ui.footerConteudo(ctx.usuario.tipo, rota);
      PV.ui.ligarNavegacaoInferior(footerEl);
      PV.ui.ligarLogout(headerEl);
    }

    try {
      switch (rota) {
        case 'login':
          await PV.screens.login(main, ctx);
          break;
        case 'cadastro':
          await PV.screens.cadastro(main, ctx);
          break;
        case 'home':
          if (ctx.usuario.tipo === 'administrador') await PV.screens.dashboardAdmin(main, ctx);
          else await PV.screens.home(main, ctx);
          break;
        case 'busca':
          if (ctx.usuario.tipo === 'administrador') await PV.screens.busca(main, { ...ctx, adminStandalone: true });
          else await PV.screens.busca(main, ctx);
          break;
        case 'vinculos':
          if (ctx.usuario.tipo !== 'acompanhante') { location.hash = '#/home'; return; }
          await PV.screens.vinculosAcompanhante(main, ctx);
          break;
        case 'sintomas':
          if (ctx.usuario.tipo !== 'acompanhante') { location.hash = '#/home'; return; }
          await PV.screens.sintomasAcompanhante(main, ctx);
          break;
        case 'contato':
          if (ctx.usuario.tipo === 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.contato(main, ctx);
          break;
        case 'triagem':
          if (ctx.usuario.tipo === 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.triagem(main, ctx);
          break;
        case 'carteirinha':
          // A carteirinha foi unificada com o Prontuário — mantém o link antigo funcionando.
          location.hash = '#/perfil';
          return;
        case 'laudo':
          if (ctx.usuario.tipo === 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.laudoDigital(main, ctx);
          break;
        case 'perfil':
          await PV.screens.perfil(main, ctx);
          break;
        case 'meu-perfil':
          if (ctx.usuario.tipo !== 'paciente') { location.hash = '#/perfil'; return; }
          await PV.screens.perfilConta(main, ctx);
          break;
        case 'sintoma':
          if (ctx.usuario.tipo === 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.detalheSintoma(main, ctx);
          break;
        case 'registrar-intensidade':
          if (ctx.usuario.tipo === 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.registrarIntensidade(main, ctx);
          break;
        case 'menu-sintomas':
          await PV.screens.menuSintomas(main, ctx);
          break;
        case 'conteudo':
          await PV.screens.conteudoDetalhe(main, ctx);
          break;
        case 'definicao':
          await PV.screens.definicaoSintomas(main, ctx);
          break;
        case 'sinal':
          await PV.screens.sinal(main, ctx);
          break;
        case 'admin-pacientes':
          if (ctx.usuario.tipo !== 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.adminPacientes(main, ctx);
          break;
        case 'admin-registros':
          if (ctx.usuario.tipo !== 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.adminRegistros(main, ctx);
          break;
        case 'admin-sintomas':
          if (ctx.usuario.tipo !== 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.adminSintomas(main, ctx);
          break;
        case 'admin-conteudos':
          if (ctx.usuario.tipo !== 'administrador') { location.hash = '#/home'; return; }
          await PV.screens.busca(main, { ...ctx, adminStandalone: true });
          break;
        case 'painel-admin':
          await PV.screens.painelAdmin(main, ctx);
          break;
        default:
          location.hash = '#/login';
          return;
      }
    } catch (e) {
      if (minhaGeracao !== geracaoAtual) return; // uma navegação mais nova já começou
      main.innerHTML = `<div class="pv-carregando"><span>${PV.ui.escaparHtml(e.message || 'Algo deu errado.')}</span></div>`;
      console.error(e);
    }

    // Se, enquanto esta renderização esperava suas chamadas assíncronas, o
    // hash mudou de novo, uma renderização mais nova já assumiu `main` — não
    // mexer mais em nada (sem isso, o cabeçalho/rodapé desta geração antiga
    // podia ser montado por cima da tela nova).
    if (minhaGeracao !== geracaoAtual) return;

    garantirLogoutMobile(main, footerEl, ctx.usuario);

    if (typeof main.scrollTo === 'function') main.scrollTo({ top: 0 });
    else main.scrollTop = 0;
  }

  /* PaliVida: logout mobile universal v1 */
  function garantirLogoutMobile(main, footerEl, usuario) {
    if (!usuario || !main) return;

    const seletoresNavegacao = [
      '.pv-home-mobile-nav',
      '.pv-sintomas-mobile-nav',
      '.pv-conteudo-mobile-nav',
      '.pv-sintoma-mobile-nav',
      '.pv-conteudos-mobile-nav',
      '.pv-perfil-conta-mobile-nav',
      '.pv-prontuario-mobile-nav',
      '.pv-cuidador-mobile-nav',
      '.pv-admin-mobile-nav',
      '.pv-dash-mobile-nav',
    ].join(', ');

    const navMobile = main.querySelector(seletoresNavegacao);
    const iconeSair = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>';
    const ligarBotaoSair = (botao) => {
      if (!botao || botao.dataset.logoutMobileLigado === 'true') return;
      botao.dataset.logoutMobileLigado = 'true';
      botao.addEventListener('click', () => {
        PV.session.limparSessao();
        PV.router.navegar('/login');
      });
    };
    const criarBotaoSair = (classeExtra = '') => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = `pv-mobile-logout-item ${classeExtra}`.trim();
      botao.dataset.sair = '';
      botao.dataset.mobileLogout = 'true';
      botao.setAttribute('aria-label', 'Sair da conta');
      botao.innerHTML = `${iconeSair}<span>Sair</span>`;
      ligarBotaoSair(botao);
      return botao;
    };

    if (navMobile) {
      if (!navMobile.querySelector('[data-mobile-logout], [data-sair]')) {
        navMobile.appendChild(criarBotaoSair());
      }
      return;
    }

    // Telas antigas que ainda usam o rodapé global recebem Sair como item da barra.
    if (footerEl && !footerEl.hidden) {
      if (!footerEl.querySelector('[data-mobile-logout]')) {
        footerEl.appendChild(criarBotaoSair('pv-mobile-global-logout'));
      }
      return;
    }

    // Último recurso para telas autenticadas sem uma barra mobile própria.
    if (!main.querySelector('[data-mobile-logout]')) {
      main.appendChild(criarBotaoSair('pv-mobile-logout-floating'));
    }
  }

  function navegar(hash) {
    if (!hash.startsWith('#')) hash = '#' + hash;
    if (location.hash === hash) renderizar();
    else location.hash = hash;
  }

  window.addEventListener('hashchange', renderizar);

  window.PV.router = { renderizar, navegar };
})();
