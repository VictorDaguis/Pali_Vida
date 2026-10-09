/**
 * Home / Busca / Dashboard — porta de screens/HomeScreen.tsx,
 * screens/BuscaScreen.tsx e screens/DashboardAdminScreen.tsx
 * (+ components/GraficoBarras.tsx).
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};

(function () {
  const { escaparHtml, aviso, carregando, spinner, svgLupa } = PV.ui;

  const TIPOS_CONTATO_HOME = [
    { id: 'hospital', rotulo: 'Hospital / UBS', tipo: 'hospital' },
    { id: 'familia', rotulo: 'Família', tipo: 'familia' },
    { id: 'sac', rotulo: 'SAC', tipo: 'sac' },
  ];

  /* ========================================================= Ícones Home === */

  const ICONES_HOME = {
    sintomas: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16.5A1.5 1.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5V5.5Z"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M7.5 7H15.5M7.5 10.5H15.5M7.5 14H12"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M16.5 15.5v4M14.5 17.5h4"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,

    prontuario: ` 
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="3" width="14" height="18" rx="2.5"
          fill="none" stroke="currentColor" stroke-width="1.8"/>
        <path d="M9 7.5h6M9 11h6M9 14.5h3"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M15.5 16.5h.01"
          fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
      </svg>
    `,

    conteudos: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v12.5H8A2.5 2.5 0 0 1 5.5 17V5A.5.5 0 0 1 6 4.5Z"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8.5 8h6M8.5 11.5h6M8.5 15h4"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,

    familia: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="9" cy="8" r="3"
          fill="none" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="17" cy="10" r="2.5"
          fill="none" stroke="currentColor" stroke-width="1.8"/>
        <path d="M3.5 19c.5-3 2.5-5 5.5-5s5 2 5.5 5"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M14.5 15.5c2.5 0 4.5 1.2 5 3.5"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,

    hospital: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 4h12v16H6z"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 7v6M9 10h6"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M9 20v-3h6v3"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,

    sac: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.5 5.5h2l1 3-1.5 1.5a10.5 10.5 0 0 0 4 4L14.5 12l3 1v2A2.5 2.5 0 0 1 15 17.5C10.3 17.5 6.5 13.7 6.5 9A2.5 2.5 0 0 1 9 6.5"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.5 4.5h4M17.5 2.5v4"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,

    apoio: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20s-6.5-4.2-8.5-8C1.9 8.9 3.7 5.5 7 5.5c2 0 3.2 1.2 4 2.5.8-1.3 2-2.5 4-2.5 3.3 0 5.1 3.4 3.5 6.5-2 3.8-8.5 8-8.5 8Z"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
  };

  /* ================================================================ Home === */

  async function home(main, ctx) {
    if (ctx.usuario.tipo === 'paciente') {
      homePaciente(main, ctx);
      return;
    }

    /*
     * A Home nova pode rolar normalmente em telas menores.
     * Não alteramos as regras de navegação existentes.
     */
    main.classList.remove('pv-sem-scroll');

    const alerta = ctx.query.alerta || 'padrao';

    const classeAlerta = {
      padrao: '',
      verde: ' home-alerta-verde',
      amarelo: ' home-alerta-amarelo',
      vermelho: ' home-alerta-vermelho',
    }[alerta] || '';

    main.innerHTML = `
      <div class="tela-home-redesign${classeAlerta}">

        <div class="home-conteudo">

          <section class="home-saudacao">
            <div class="home-saudacao-texto">
              <span class="home-eyebrow">PaliVida</span>

              <h1 id="home-saudacao">Olá!</h1>

              <p>
                Aqui você pode registrar seus sintomas,
                acompanhar seu prontuário e acessar
                informações importantes para o seu cuidado.
              </p>
            </div>
          </section>

          ${
            alerta !== 'padrao'
              ? `
                <section class="home-alerta">
                  <div class="home-alerta-indicador" aria-hidden="true"></div>

                  <div class="home-alerta-texto">
                    <strong>Resultado da última triagem</strong>
                    <span>
                      ${
                        alerta === 'verde'
                          ? 'Nenhum sinal de alerta identificado.'
                          : alerta === 'amarelo'
                            ? 'Alguns sinais merecem atenção.'
                            : 'Foram identificados sinais que exigem atenção.'
                      }
                    </span>
                  </div>
                </section>
              `
              : ''
          }

          <section class="home-acoes">

            <button
              class="home-card home-card-principal"
              id="btn-registrar"
              type="button"
            >
              <div class="home-card-icone">
                ${ICONES_HOME.sintomas}
              </div>

              <div class="home-card-conteudo">
                <span class="home-card-label">
                  Acompanhe como você está
                </span>

                <h2>Registrar sintomas de hoje</h2>

                <p>
                  Conte como você está se sentindo para
                  acompanhar sua evolução.
                </p>

                <span class="home-card-link">
                  Começar agora
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>

            <button
              class="home-card home-card-prontuario"
              id="btn-prontuario"
              type="button"
            >
              <div class="home-card-icone">
                ${ICONES_HOME.prontuario}
              </div>

              <div class="home-card-conteudo">
                <span class="home-card-label">
                  Meu acompanhamento
                </span>

                <h2>Prontuário</h2>

                <p>
                  Acesse seus dados, histórico e
                  informações importantes.
                </p>

                <span class="home-card-link">
                  Visualizar
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>

            <button
              class="home-card home-card-conteudos"
              id="btn-duvidas"
              type="button"
            >
              <div class="home-card-icone">
                ${ICONES_HOME.conteudos}
              </div>

              <div class="home-card-conteudo">
                <span class="home-card-label">
                  Informação
                </span>

                <h2>Entendendo os sintomas</h2>

                <p>
                  Encontre informações e orientações
                  sobre sintomas e sinais de alerta.
                </p>

                <span class="home-card-link">
                  Explorar
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>

          </section>

          <section class="home-apoio">

            <div class="home-apoio-header">
              <div>
                <h2>Seus contatos</h2>
                <p>
                  Pessoas e serviços importantes para você.
                </p>
              </div>
            </div>

            <div class="home-contatos">

              <button
                class="home-contato"
                data-contato="familia"
                type="button"
              >
                <span class="home-contato-icone">
                  ${ICONES_HOME.familia}
                </span>

                <span class="home-contato-info">
                  <strong>Família</strong>
                  <small>Contato de apoio</small>
                </span>

                <span class="home-contato-seta" aria-hidden="true">
                  ›
                </span>
              </button>

              <button
                class="home-contato"
                data-contato="hospital"
                type="button"
              >
                <span class="home-contato-icone home-contato-hospital">
                  ${ICONES_HOME.hospital}
                </span>

                <span class="home-contato-info">
                  <strong>Hospital / UBS</strong>
                  <small>Unidade de referência</small>
                </span>

                <span class="home-contato-seta" aria-hidden="true">
                  ›
                </span>
              </button>

              <button
                class="home-contato"
                data-contato="sac"
                type="button"
              >
                <span class="home-contato-icone home-contato-sac">
                  ${ICONES_HOME.sac}
                </span>

                <span class="home-contato-info">
                  <strong>SAC</strong>
                  <small>Serviço de atendimento</small>
                </span>

                <span class="home-contato-seta" aria-hidden="true">
                  ›
                </span>
              </button>

            </div>
          </section>

          <section class="home-mensagem">
            <span class="home-mensagem-icone">
              ${ICONES_HOME.apoio}
            </span>

            <div>
              <strong>Você não está sozinho.</strong>

              <p>
                O PaliVida está aqui para apoiar sua jornada.
              </p>
            </div>
          </section>

        </div>
      </div>
    `;

    /* ---------------------------------------------------- navegação */

    main
      .querySelector('#btn-prontuario')
      .addEventListener('click', () => {
        PV.router.navegar('/perfil');
      });

    main
      .querySelector('#btn-duvidas')
      .addEventListener('click', () => {
        PV.router.navegar('/triagem');
      });

    main
      .querySelector('#btn-registrar')
      .addEventListener('click', () => {
        PV.router.navegar('/menu-sintomas');
      });

    main
      .querySelectorAll('[data-contato]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          PV.router.navegar(`/contato/${btn.dataset.contato}`);
        });
      });

    /* ------------------------------------------------------ nome */

    try {
      const dados =
        ctx.usuario.tipo === 'acompanhante'
          ? await PV.db.acompanhantes.buscar(ctx.usuario.id)
          : await PV.db.pacientes.buscar(ctx.usuario.id);

      const nome =
        dados.nome_social ||
        dados.nome ||
        dados.nome_completo;

      const alvo = main.querySelector('#home-saudacao');

      if (nome && alvo) {
        alvo.textContent = `Olá, ${nome}!`;
      }
    } catch {
      /*
       * Se não conseguir carregar os dados do usuário,
       * a Home continua funcionando com "Olá!".
       */
    }
  }

  function iconePainel(nome) {
    const caminhos = {
      inicio: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
      triagem: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M8 9h8M8 13h8M8 17h5"/>',
      sino: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
      seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
      usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      coracao: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
      folha: '<path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z"/><path d="M3 21c3-5 7-8 13-11"/>',
      sair: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    };
    const icone = ICONES_HOME[nome] || caminhos[nome] || '';
    return icone.startsWith('<svg')
      ? icone
      : `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icone}</svg>`;
  }

  function sidebarPaciente(rotaAtiva = 'home') {

    const estaAtiva = (rota) =>
      rotaAtiva === rota ? ' active' : '';
  
    return `
      <aside
        class="pv-sidebar"
        aria-label="Navegação principal"
      >
  
        <div>
  
          <div class="pv-sidebar-brand">
  
            <a
              href="#/home"
              aria-label="PaliVida — início"
            >
  
              <img
                src="assets/img/logo-completo.png"
                alt="PaliVida"
              >
  
            </a>
  
          </div>
  
  
          <div class="pv-sidebar-section-label">
            MEU CUIDADO
          </div>
  
  
          <nav class="pv-sidebar-nav">
  
            <button
              class="pv-sidebar-item${estaAtiva('home')}"
              type="button"
              data-rota="/home"
            >
              ${iconePainel('inicio')}
              <span>Início</span>
            </button>
  
  
            <button
              class="pv-sidebar-item${estaAtiva('sintomas')}"
              type="button"
              data-rota="/menu-sintomas"
            >
              ${iconePainel('sintomas')}
              <span>Sintomas</span>
            </button>
  
  
            <button
              class="pv-sidebar-item${estaAtiva('conteudos')}"
              type="button"
              data-rota="/busca"
            >
              ${iconePainel('conteudos')}
              <span>Conteúdos</span>
            </button>
  
  
            <button
              class="pv-sidebar-item${estaAtiva('prontuario')}"
              type="button"
              data-rota="/perfil"
            >
              ${iconePainel('prontuario')}
              <span>Prontuário</span>
            </button>
  
  
            <button
              class="pv-sidebar-item${estaAtiva('perfil')}"
              type="button"
              data-rota="/meu-perfil"
            >
              ${iconePainel('usuario')}
              <span>Perfil</span>
            </button>
  
          </nav>
  
        </div>
  
  
        <div class="pv-sidebar-footer">
  
          <div class="pv-sidebar-profile">
  
            <span class="pv-sidebar-avatar" id="pv-sidebar-paciente-avatar" aria-hidden="true">P</span>
  
            <span class="pv-sidebar-profile-text">
  
              <strong id="pv-sidebar-paciente-name">
                Paciente
              </strong>
  
              <small>
                Paciente
              </small>
  
            </span>
  
          </div>
  
  
          <button
            class="pv-sidebar-logout"
            type="button"
            data-sair
          >
  
            ${iconePainel('sair')}
  
            <span>
              Sair
            </span>
  
          </button>
  
        </div>
  
      </aside>
    `;
  }

  PV.ui.sidebarPaciente = sidebarPaciente;

  /* Atualiza nome e iniciais do perfil no rodapé da sidebar compartilhada. */
  function atualizarPerfilSidebarPaciente(root, nomeInformado) {
    if (!root || typeof root.querySelector !== 'function') return;
    const nome = String(nomeInformado || '').trim() || 'Paciente';
    const nomeEl = root.querySelector('#pv-sidebar-paciente-name');
    const avatarEl = root.querySelector('#pv-sidebar-paciente-avatar');
    if (nomeEl) nomeEl.textContent = nome;
    if (avatarEl) {
      const ignorar = new Set(['e', 'da', 'de', 'do', 'das', 'dos']);
      const partes = nome.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean)
        .filter((parte) => !ignorar.has(parte.toLocaleLowerCase('pt-BR')));
      const iniciais = partes.length > 1
        ? partes[0].charAt(0) + partes[1].charAt(0)
        : (partes[0] || 'P').slice(0, 2);
      avatarEl.textContent = iniciais.toLocaleUpperCase('pt-BR');
    }
  }
  PV.ui.atualizarPerfilSidebarPaciente = atualizarPerfilSidebarPaciente;


  function homePaciente(main, ctx) {

    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-dashboard-paciente-main');
  
    main.innerHTML = `
      <div class="pv-home-layout">
  
        <!-- =========================================================
             SIDEBAR DESKTOP
             ========================================================= -->
  
             ${sidebarPaciente('home')}
  
  
        <!-- =========================================================
             ÁREA PRINCIPAL
             ========================================================= -->
  
        <section class="pv-home-workspace">
  
          <!-- TOPBAR -->
  
          <header class="pv-topbar">
            <div class="pv-topbar-title">Meu cuidado</div>
            <div class="pv-topbar-actions">
              <span class="pv-home-topbar-demo">Protótipo demonstrativo</span>
              <button class="pv-home-icon-button" type="button" aria-label="Pesquisar conteúdos" title="Pesquisar conteúdos" data-rota="/busca">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path>
                </svg>
              </button>
              <button class="pv-home-icon-button" type="button" aria-label="Abrir triagem" title="Abrir triagem" data-rota="/triagem">
                ${iconePainel('sino')}
              </button>
            </div>
          </header>
  
  
          <!-- CONTEÚDO -->
  
          <div class="pv-home-content">
  
            <!-- =====================================================
                 BOAS-VINDAS
                 ===================================================== -->
  
            <section class="pv-home-welcome">
  
              <div>
  
                <span class="pv-page-eyebrow">
                  PaliVida
                </span>
  
                <h1 id="pv-dash-welcome-name">
                  Bem-vindo(a)!
                </h1>
  
                <p>
                  Aqui você pode registrar seus sintomas,
                  acompanhar seu prontuário e acessar conteúdos
                  que podem te ajudar.
                </p>
  
              </div>
  
              <div class="pv-home-welcome-icon" aria-hidden="true">
                👋
              </div>
  
            </section>
  
  
            <!-- ERRO DE CARREGAMENTO -->
  
            <div id="pv-dash-aviso"></div>
  
  
            <!-- =====================================================
                 AÇÕES PRINCIPAIS
                 ===================================================== -->
  
            <section class="pv-home-actions">
  
              <!-- Registrar sintomas -->
  
              <article
                class="pv-home-action pv-home-action-primary"
              >
  
                <div class="pv-home-action-icon">
                  ${iconePainel('sintomas')}
                </div>
  
                <div class="pv-home-action-content">
  
                  <span class="pv-home-action-label">
                    Acompanhe como você está
                  </span>
  
                  <h2>
                    Registrar sintomas de hoje
                  </h2>
  
                  <p>
                    Conte como você está se sentindo para
                    acompanhar sua evolução.
                  </p>
  
                  <button
                    type="button"
                    class="pv-home-action-link"
                    data-rota="/menu-sintomas"
                  >
                    Começar agora
                    ${iconePainel('seta')}
                  </button>
  
                </div>
  
                <span
                  class="pv-home-action-decoration"
                  aria-hidden="true"
                >
                  ${iconePainel('folha')}
                </span>
  
              </article>
  
  
              <!-- Prontuário -->
  
              <article
                class="pv-home-action"
              >
  
                <div class="pv-home-action-icon">
                  ${iconePainel('prontuario')}
                </div>
  
                <div class="pv-home-action-content">
  
                  <span class="pv-home-action-label">
                    Meu acompanhamento
                  </span>
  
                  <h2>
                    Prontuário
                  </h2>
  
                  <p>
                    Acesse seus dados, histórico e
                    informações importantes.
                  </p>
  
                  <button
                    type="button"
                    class="pv-home-action-link"
                    data-rota="/perfil"
                  >
                    Visualizar
                    ${iconePainel('seta')}
                  </button>
  
                </div>
  
              </article>
  
  
              <!-- Conteúdos -->
  
              <article
                class="pv-home-action"
              >
  
                <div class="pv-home-action-icon">
                  ${iconePainel('conteudos')}
                </div>
  
                <div class="pv-home-action-content">
  
                  <span class="pv-home-action-label">
                    Informação
                  </span>
  
                  <h2>
                    Conteúdos e orientações
                  </h2>
  
                  <p>
                    Informações e dicas que podem
                    te ajudar no dia a dia.
                  </p>
  
                  <button
                    type="button"
                    class="pv-home-action-link"
                    data-rota="/busca"
                  >
                    Explorar
                    ${iconePainel('seta')}
                  </button>
  
                </div>
  
              </article>
  
            </section>
  
  
            <!-- =====================================================
                 CONTATOS + LEMBRETE
                 ===================================================== -->
  
            <section class="pv-home-support">
  
              <div class="pv-home-contacts">
  
                <div class="pv-home-section-heading">
  
                  <div class="pv-icon-circle">
                    ${iconePainel('familia')}
                  </div>
  
                  <div>
                    <h2>
                      Seus contatos
                    </h2>
  
                    <p>
                      Pessoas e serviços importantes para você.
                    </p>
                  </div>
  
                </div>
  
  
                <div class="pv-home-contact-list">
  
                  <!-- Família -->
  
                  <button
                    class="pv-home-contact"
                    type="button"
                    data-rota="/contato/familia"
                  >
  
                    <span class="pv-home-contact-icon pv-home-contact-purple">
                      ${iconePainel('familia')}
                    </span>
  
                    <span class="pv-home-contact-copy">
  
                      <strong>
                        Cuidador
                      </strong>
  
                      <small id="pv-dash-caregiver">
                        Cadastre um contato
                      </small>
  
                    </span>
  
                    <span aria-hidden="true">
                      →
                    </span>
  
                  </button>
  
  
                  <!-- Emergência -->
  
                  <a
                    class="pv-home-contact"
                    id="pv-dash-emergency"
                    href="#/perfil"
                  >
  
                    <span class="pv-home-contact-icon pv-home-contact-green">
                      ${iconePainel('sac')}
                    </span>
  
                    <span class="pv-home-contact-copy">
  
                      <strong>
                        Emergência
                      </strong>
  
                      <small id="pv-dash-emergency-value">
                        Cadastre no prontuário
                      </small>
  
                    </span>
  
                    <span aria-hidden="true">
                      →
                    </span>
  
                  </a>
  
  
                  <!-- Unidade -->
  
                  <button
                    class="pv-home-contact"
                    type="button"
                    data-rota="/perfil"
                  >
  
                    <span class="pv-home-contact-icon pv-home-contact-blue">
                      ${iconePainel('hospital')}
                    </span>
  
                    <span class="pv-home-contact-copy">
  
                      <strong>
                        Unidade de saúde
                      </strong>
  
                      <small id="pv-dash-health-unit">
                        Cadastre no prontuário
                      </small>
  
                    </span>
  
                    <span aria-hidden="true">
                      →
                    </span>
  
                  </button>
  
                </div>
  
              </div>
  
  
              <!-- LEMBRETE -->
  
              <aside class="pv-home-reminder">
  
                <div class="pv-home-reminder-icon">
                  ${iconePainel('sol')}
                </div>
  
                <span class="pv-home-reminder-label">
                  Lembre-se
                </span>
  
                <h2>
                  Seu cuidado vem primeiro.
                </h2>
  
                <p>
                  Em caso de falta de ar intensa,
                  dor forte ou qualquer sinal de alerta,
                  busque atendimento médico imediato.
                </p>
  
              </aside>
  
            </section>
  
  
            <!-- =====================================================
                 MENSAGEM FINAL
                 ===================================================== -->
  
            <section class="pv-home-reassurance">
  
              <span class="pv-home-reassurance-icon">
                ${iconePainel('folha')}
              </span>
  
              <div>
  
                <strong>
                  Você não está sozinho.
                </strong>
  
                <small>
                  O PaliVida está aqui para te apoiar, sempre.
                </small>
  
              </div>
  
              <span class="pv-home-reassurance-heart">
                ${iconePainel('coracao')}
              </span>
  
            </section>
  
          </div>
  
        </section>
  
  
        <!-- =========================================================
             NAVEGAÇÃO MOBILE
             ========================================================= -->
  
        <nav
          class="pv-home-mobile-nav"
          aria-label="Navegação mobile"
        >
  
          <button
            class="active"
            type="button"
            data-rota="/home"
          >
            ${iconePainel('inicio')}
            <span>Início</span>
          </button>
  
          <button
            type="button"
            data-rota="/menu-sintomas"
          >
            ${iconePainel('sintomas')}
            <span>Sintomas</span>
          </button>
  
          <button
            type="button"
            data-rota="/triagem"
          >
            ${iconePainel('triagem')}
            <span>Triagem</span>
          </button>
  
          <button
            type="button"
            data-rota="/meu-perfil"
          >
            ${iconePainel('usuario')}
            <span>Perfil</span>
          </button>
  
        </nav>
  
      </div>
    `;
  
  
    /* ================================================================
       NAVEGAÇÃO
       ================================================================ */
  
    const painel = main.querySelector('.pv-home-layout');
  
    PV.ui.ligarLogout(painel);
  
    main
      .querySelectorAll('[data-rota]')
      .forEach((botao) => {
  
        botao.addEventListener('click', () => {
          PV.router.navegar(botao.dataset.rota);
        });
  
      });
  
  
    /* ================================================================
       ERROS
       ================================================================ */
  
    function mostrarErro(erro) {
  
      const alvo =
        painel.querySelector('#pv-dash-aviso');
  
      if (
        painel.isConnected &&
        alvo &&
        !alvo.textContent
      ) {
  
        alvo.innerHTML = aviso({
          tipo: 'erro',
          texto:
            erro.message ||
            'Não foi possível carregar os dados do painel.'
        });
  
      }
  
    }
  
  
    /* ================================================================
       DADOS DO PACIENTE
       ================================================================ */
  
    const carregarPaciente =
      PV.db.pacientes
        .buscar(ctx.usuario.id)
  
        .then((paciente) => {
  
          if (!painel.isConnected) {
            return;
          }
  
          const nome =
            paciente.nome_social ||
            paciente.nome ||
            'Paciente';
  
  
          /* Nome de boas-vindas */
  
          painel
            .querySelector('#pv-dash-welcome-name')
            .textContent =
              `Olá, ${nome}`;
  
  
          /* Nome no perfil */
  
          const nomeTopoPerfil = painel.querySelector("#pv-dash-profile-name");

  
          if (nomeTopoPerfil) nomeTopoPerfil.textContent = nome;
  
  
            /* Nome na sidebar */

            const nomeSidebar =
            painel.querySelector(
              '#pv-sidebar-paciente-name'
            );

            if (nomeSidebar) {
            nomeSidebar.textContent = nome;
            }
            PV.ui.atualizarPerfilSidebarPaciente(painel, nome);

          /* Emergência */
  
          painel
            .querySelector('#pv-dash-emergency-value')
            .textContent =
              paciente.contato_emergencia ||
              'Cadastre no prontuário';
  
  
          /* Unidade de saúde */
            
          painel
            .querySelector('#pv-dash-health-unit')
            .textContent =
              paciente.unidades_de_saude ||
              [
                paciente.cidade,
                paciente.estado
              ]
                .filter(Boolean)
                .join(' — ') ||
              'Cadastre no prontuário';
  
  
          /* Telefone de emergência */
  
          const telefone =
            String(
              paciente.contato_emergencia || ''
            ).match(
              /(?:\+?\d[\d\s().-]{7,}\d)/
            );
  
  
          if (telefone) {
  
            painel
              .querySelector('#pv-dash-emergency')
              .href =
                `tel:${telefone[0]
                  .replace(/[^\d+]/g, '')}`;
  
          }
  
        })
  
        .catch(mostrarErro);
  
  
    /* ================================================================
       CONTATO DA FAMÍLIA
       ================================================================ */
  
    const carregarContato =
      PV.db.contatos
        .buscar('familia')
  
        .then((contato) => {
  
          if (!painel.isConnected) {
            return;
          }
  
  
          const nomePadrao =
            'Nome do familiar ou cuidador';
  
  
          const nome =
            contato.nome === nomePadrao
              ? ''
              : contato.nome;
  
  
          painel
            .querySelector('#pv-dash-caregiver')
            .textContent =
              nome
                ? [
                    nome,
                    contato.observacao
                  ]
                    .filter(Boolean)
                    .join(' · ')
                : 'Cadastre um contato';
  
        })
  
        .catch(mostrarErro);
  
  
    Promise.all([
      carregarPaciente,
      carregarContato
    ]);
  
  }

  /* ============================================================= Contato === */

  // Cada botão da Home ("Hospital", "Família", "SAC") abre esta mesma tela,
  // parametrizada pelo tipo (ctx.sub). Ela chega preenchida com um exemplo
  // genérico (PV.db.contatos.buscar) que o usuário edita e salva — os dados
  // ficam por conta de cada paciente/cuidador (ver comentário em db.js).
  async function contato(main, ctx) {
    const tipo = ctx.sub;

    const rotulo =
      (TIPOS_CONTATO_HOME.find((t) => t.id === tipo) || {}).rotulo;

    if (!rotulo) {
      PV.router.navegar('/home');
      return;
    }

    main.innerHTML = `
      <div class="pv-carregando" style="min-height:200px">
        ${spinner()}
      </div>
    `;

    let dados;

    try {
      dados = await PV.db.contatos.buscar(tipo);
    } catch (e) {
      main.innerHTML = `
        <div class="tela-contato">
          ${aviso({
            tipo: 'erro',
            texto: e.message || 'Não foi possível carregar este contato.',
          })}
        </div>
      `;
      return;
    }

    function montar() {
      main.innerHTML = `
        <div class="tela-contato">

          <h1 class="titulo">
            Contato — ${escaparHtml(rotulo)}
          </h1>

          <p class="subtitulo">
            ${
              dados.preenchido
                ? 'Edite os dados abaixo sempre que precisar.'
                : 'Preenchemos um exemplo para você — edite com os dados reais e salve.'
            }
          </p>

          <div class="pv-card">

            <label class="pv-campo-label" for="ct-nome">
              Nome
            </label>

            <input
              class="pv-campo-input"
              id="ct-nome"
              type="text"
              value="${escaparHtml(dados.nome)}"
            >

            <label class="pv-campo-label" for="ct-telefone">
              Telefone
            </label>

            <input
              class="pv-campo-input"
              id="ct-telefone"
              type="tel"
              value="${escaparHtml(dados.telefone)}"
            >

            <label class="pv-campo-label" for="ct-observacao">
              ${
                tipo === 'familia'
                  ? 'Parentesco'
                  : tipo === 'sac'
                    ? 'Horário de atendimento'
                    : 'Endereço / observação'
              }
            </label>

            <input
              class="pv-campo-input"
              id="ct-observacao"
              type="text"
              value="${escaparHtml(dados.observacao)}"
            >

            <div id="ct-aviso"></div>

            <div class="pv-contato-acoes">

              <a
                class="pv-botao-secundario"
                id="ct-ligar"
                href="tel:${escaparHtml(
                  String(dados.telefone).replace(/[^0-9+]/g, ''),
                )}"
              >
                Ligar agora
              </a>

              <button
                type="button"
                class="pv-botao-primario"
                id="ct-salvar"
              >
                Salvar
              </button>

            </div>
          </div>
        </div>
      `;

      const avisoEl = main.querySelector('#ct-aviso');
      const telefoneEl = main.querySelector('#ct-telefone');
      const ligarEl = main.querySelector('#ct-ligar');

      telefoneEl.addEventListener('input', () => {
        ligarEl.href = `tel:${telefoneEl.value.replace(/[^0-9+]/g, '')}`;
      });

      main
        .querySelector('#ct-salvar')
        .addEventListener('click', async () => {
          const botao = main.querySelector('#ct-salvar');

          const novoForm = {
            nome: main.querySelector('#ct-nome').value.trim(),
            telefone: main.querySelector('#ct-telefone').value.trim(),
            observacao: main
              .querySelector('#ct-observacao')
              .value.trim(),
          };

          botao.disabled = true;

          try {
            dados = await PV.db.contatos.salvar(tipo, novoForm);

            montar();

            main.querySelector('#ct-aviso').innerHTML = aviso({
              tipo: 'sucesso',
              texto: 'Contato salvo!',
            });
          } catch (e) {
            botao.disabled = false;

            avisoEl.innerHTML = aviso({
              tipo: 'erro',
              texto: e.message || 'Erro ao salvar.',
            });
          }
        });
    }

    montar();
  }

  /* =============================================================== Busca === */

  // Esta tela (rota /busca, "Entendendo os sintomas") é onde o admin cria/
  // edita/exclui os itens de PV.db.conteudos.
  const FORM_CONTEUDO_VAZIO = {
    id: null,
    titulo: '',
    descricao: '',
    SinaisSintomas: '',
    SinaisAlerta: '',
  };

  function formatarDataConteudo(valor) {
    if (!valor) return '';

    const [ano, mes, dia] =
      String(valor)
        .split('T')[0]
        .split('-');

    return dia && mes && ano
      ? `${dia}/${mes}/${ano}`
      : valor;
  }

  function cardConteudoHtml(c, ehAdmin) {
    return `
      <div class="pv-card-conteudo" data-id="${c.id}">

        <div class="card-titulo">
          ${escaparHtml(c.titulo)}
        </div>

        <div class="divisor"></div>

        <div class="card-descricao">
          ${escaparHtml(c.descricao)}
        </div>

        <div class="card-rodape">

          <button
            class="botao-ler"
            type="button"
            data-ler="${c.id}"
          >
            Ler mais
            <img src="assets/img/seta.png" alt="">
          </button>

          <span class="data">
            ${escaparHtml(formatarDataConteudo(c.data_post))}
          </span>

        </div>

        ${
          ehAdmin
            ? `
              <div class="acoes-admin">

                <button
                  class="acao-editar"
                  type="button"
                  data-editar="${c.id}"
                >
                  Editar
                </button>

                <button
                  class="acao-excluir"
                  type="button"
                  data-excluir="${c.id}"
                >
                  Excluir
                </button>

              </div>
            `
            : ''
        }

      </div>
    `;
  }

  /* ==================================================== ConteudosPaciente === */
  async function buscaPacienteLovable(main, ctx) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }

    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-conteudos-main');

    main.innerHTML = `
      <div class="pv-conteudos-modern">
        ${PV.ui.sidebarPaciente('conteudos')}

        <section class="pv-conteudos-workspace">
          <header class="pv-conteudos-topbar">
            <span class="pv-conteudos-demo">Protótipo demonstrativo</span>
            <button type="button" class="pv-conteudos-topbar-icon" id="pv-conteudos-focus-search" aria-label="Pesquisar conteúdos" title="Pesquisar conteúdos">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path>
              </svg>
            </button>
            <button type="button" class="pv-conteudos-topbar-icon pv-conteudos-notificacao" data-rota="/triagem" aria-label="Abrir triagem" title="Abrir triagem">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>
              </svg><span class="pv-conteudos-notificacao-dot" aria-hidden="true"></span>
            </button>
          </header>

          <div class="pv-conteudos-content">
            <section class="pv-conteudos-heading">
              <div>
                <span class="pv-conteudos-eyebrow">BIBLIOTECA DE CUIDADO</span>
                <h1>Conteúdos para você</h1>
                <p>Informações educativas para entender melhor os sintomas e conversar com sua equipe de saúde.</p>
              </div>
            </section>

            <div class="pv-conteudos-search-row">
              <label class="pv-conteudos-search" for="busca-input">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path>
                </svg>
                <input id="busca-input" type="search" placeholder="Buscar por tema ou sintoma..." autocomplete="off" aria-label="Buscar conteúdos por tema ou sintoma">
              </label>
              <button class="pv-conteudos-refresh" id="btn-recarregar" type="button" aria-label="Atualizar conteúdos" title="Atualizar conteúdos">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5"></path><path d="M4 17v-5h5"></path><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"></path></svg>
              </button>
            </div>

            <div class="pv-conteudos-results-heading">
              <h2>Todos os conteúdos</h2>
              <span id="pv-conteudos-count">Carregando...</span>
            </div>
            <div id="busca-aviso" class="pv-conteudos-notice" aria-live="polite"></div>
            <div id="busca-lista" class="pv-conteudos-grid" aria-live="polite">
              <div class="pv-conteudos-loading">Carregando conteúdos...</div>
            </div>
          </div>

          <nav class="pv-conteudos-mobile-nav" aria-label="Navegação principal">
            <button type="button" data-rota="/home">
              ${iconePainel('inicio')}<span>Início</span>
            </button>
            <button type="button" data-rota="/menu-sintomas">
              ${iconePainel('sintomas')}<span>Sintomas</span>
            </button>
            <button type="button" class="active" data-rota="/busca">
              ${iconePainel('conteudos')}<span>Conteúdos</span>
            </button>
            <button type="button" data-rota="/meu-perfil">
              ${iconePainel('usuario')}<span>Perfil</span>
            </button>
          </nav>
        </section>
      </div>
    `;

    const layout = main.querySelector('.pv-conteudos-modern');
    const listaEl = main.querySelector('#busca-lista');
    const buscaEl = main.querySelector('#busca-input');
    const avisoEl = main.querySelector('#busca-aviso');
    const contadorEl = main.querySelector('#pv-conteudos-count');
    let lista = [];
    let textoBusca = '';

    PV.ui.ligarLogout(layout);
    layout.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });

    PV.db.pacientes.buscar(ctx.usuario.id).then((paciente) => {
      const nome = paciente?.nome_social || paciente?.nome || 'Paciente';
      PV.ui.atualizarPerfilSidebarPaciente(layout, nome);
      const nomeEl = layout.querySelector('#pv-sidebar-paciente-name');
      if (nomeEl) nomeEl.textContent = nome;
    }).catch(() => {});

    function cardHtml(conteudo) {
      const descricao = String(conteudo.descricao || conteudo.texto || '').trim();
      const resumo = descricao.length > 190 ? `${descricao.slice(0, 187).trimEnd()}…` : descricao;
      const data = formatarDataConteudo(conteudo.data_post);
      return `
        <article class="pv-conteudos-card">
          <div class="pv-conteudos-card-top">
            <span class="pv-conteudos-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 1 5 16.5z"></path><path d="M8.5 7H16M8.5 10.5H16M8.5 14H13"></path><path d="M5 16.5A2.5 2.5 0 0 0 7.5 19H20v3H7.5A2.5 2.5 0 0 1 5 19.5z"></path>
              </svg>
            </span>
            <span class="pv-conteudos-card-label">EDUCAÇÃO EM SAÚDE</span>
          </div>
          <h3>${escaparHtml(conteudo.titulo || 'Conteúdo educativo')}</h3>
          <p>${escaparHtml(resumo || 'Consulte as informações educativas deste tema e saiba quais sinais observar.')}</p>
          <div class="pv-conteudos-card-footer">
            <span class="pv-conteudos-card-date">${data ? `Atualizado em ${escaparHtml(data)}` : 'Material educativo'}</span>
            <button type="button" class="pv-conteudos-read" data-ler="${escaparHtml(conteudo.id)}">
              <span>Ler conteúdo</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
            </button>
          </div>
        </article>
      `;
    }

    function renderLista() {
      const termo = textoBusca.trim().toLocaleLowerCase('pt-BR');
      const filtrados = lista.filter((item) =>
        `${item.titulo || ''} ${item.descricao || item.texto || ''}`.toLocaleLowerCase('pt-BR').includes(termo)
      );
      contadorEl.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'conteúdo' : 'conteúdos'}`;

      if (!filtrados.length) {
        listaEl.innerHTML = `
          <div class="pv-conteudos-empty">
            <span class="pv-conteudos-empty-icon" aria-hidden="true">⌕</span>
            <h3>Nenhum conteúdo encontrado</h3>
            <p>Tente buscar por outro tema ou sintoma.</p>
            ${termo ? '<button type="button" id="pv-conteudos-limpar">Limpar busca</button>' : ''}
          </div>
        `;
        const limpar = listaEl.querySelector('#pv-conteudos-limpar');
        if (limpar) limpar.addEventListener('click', () => { buscaEl.value = ''; textoBusca = ''; renderLista(); buscaEl.focus(); });
        return;
      }

      listaEl.innerHTML = filtrados.map(cardHtml).join('');
      listaEl.querySelectorAll('[data-ler]').forEach((botao) => {
        botao.addEventListener('click', () => PV.router.navegar('/conteudo/' + botao.dataset.ler));
      });
    }

    async function carregar() {
      listaEl.innerHTML = '<div class="pv-conteudos-loading">Carregando conteúdos...</div>';
      avisoEl.innerHTML = '';
      contadorEl.textContent = 'Carregando...';
      try {
        lista = await PV.db.conteudos.listar({ timeoutMs: 20000 });
        renderLista();
      } catch (e) {
        lista = [];
        contadorEl.textContent = 'Não foi possível carregar';
        listaEl.innerHTML = `
          <div class="pv-conteudos-empty pv-conteudos-empty-error">
            <span class="pv-conteudos-empty-icon" aria-hidden="true">!</span>
            <h3>Não foi possível carregar os conteúdos</h3>
            <p>${escaparHtml(e.message || 'Verifique sua conexão e tente novamente.')}</p>
            <button type="button" id="pv-conteudos-retry">Tentar novamente</button>
          </div>
        `;
        listaEl.querySelector('#pv-conteudos-retry').addEventListener('click', carregar);
      }
    }

    buscaEl.addEventListener('input', () => {
      textoBusca = buscaEl.value;
      renderLista();
    });
    main.querySelector('#btn-recarregar').addEventListener('click', carregar);
    main.querySelector('#pv-conteudos-focus-search').addEventListener('click', () => buscaEl.focus());
    await carregar();
  }

  /* ==================================================== ConteudosPaciente === */
  async function buscaPacienteLovable(main, ctx) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }

    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-conteudos-main');

    main.innerHTML = `
      <div class="pv-conteudos-modern">
        ${PV.ui.sidebarPaciente('conteudos')}

        <section class="pv-conteudos-workspace">
          <header class="pv-conteudos-topbar">
            <span class="pv-conteudos-demo">Protótipo demonstrativo</span>
            <button type="button" class="pv-conteudos-topbar-icon" id="pv-conteudos-focus-search" aria-label="Pesquisar conteúdos" title="Pesquisar conteúdos">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path>
              </svg>
            </button>
            <button type="button" class="pv-conteudos-topbar-icon pv-conteudos-notificacao" data-rota="/triagem" aria-label="Abrir triagem" title="Abrir triagem">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>
              </svg><span class="pv-conteudos-notificacao-dot" aria-hidden="true"></span>
            </button>
          </header>

          <div class="pv-conteudos-content">
            <section class="pv-conteudos-heading">
              <div>
                <span class="pv-conteudos-eyebrow">BIBLIOTECA DE CUIDADO</span>
                <h1>Conteúdos para você</h1>
                <p>Informações educativas para entender melhor os sintomas e conversar com sua equipe de saúde.</p>
              </div>
            </section>

            <div class="pv-conteudos-search-row">
              <label class="pv-conteudos-search" for="busca-input">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path>
                </svg>
                <input id="busca-input" type="search" placeholder="Buscar por tema ou sintoma..." autocomplete="off" aria-label="Buscar conteúdos por tema ou sintoma">
              </label>
              <button class="pv-conteudos-refresh" id="btn-recarregar" type="button" aria-label="Atualizar conteúdos" title="Atualizar conteúdos">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5"></path><path d="M4 17v-5h5"></path><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"></path></svg>
              </button>
            </div>

            <div class="pv-conteudos-results-heading">
              <h2>Todos os conteúdos</h2>
              <span id="pv-conteudos-count">Carregando...</span>
            </div>
            <div id="busca-aviso" class="pv-conteudos-notice" aria-live="polite"></div>
            <div id="busca-lista" class="pv-conteudos-grid" aria-live="polite">
              <div class="pv-conteudos-loading">Carregando conteúdos...</div>
            </div>
          </div>

          <nav class="pv-conteudos-mobile-nav" aria-label="Navegação principal">
            <button type="button" data-rota="/home">
              ${iconePainel('inicio')}<span>Início</span>
            </button>
            <button type="button" data-rota="/menu-sintomas">
              ${iconePainel('sintomas')}<span>Sintomas</span>
            </button>
            <button type="button" class="active" data-rota="/busca">
              ${iconePainel('conteudos')}<span>Conteúdos</span>
            </button>
            <button type="button" data-rota="/meu-perfil">
              ${iconePainel('usuario')}<span>Perfil</span>
            </button>
          </nav>
        </section>
      </div>
    `;

    const layout = main.querySelector('.pv-conteudos-modern');
    const listaEl = main.querySelector('#busca-lista');
    const buscaEl = main.querySelector('#busca-input');
    const avisoEl = main.querySelector('#busca-aviso');
    const contadorEl = main.querySelector('#pv-conteudos-count');
    let lista = [];
    let textoBusca = '';

    PV.ui.ligarLogout(layout);
    layout.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });

    PV.db.pacientes.buscar(ctx.usuario.id).then((paciente) => {
      const nome = paciente?.nome_social || paciente?.nome || 'Paciente';
      const nomeEl = layout.querySelector('#pv-sidebar-paciente-name');
      if (nomeEl) nomeEl.textContent = nome;
    }).catch(() => {});

    function cardHtml(conteudo) {
      const descricao = String(conteudo.descricao || conteudo.texto || '').trim();
      const resumo = descricao.length > 190 ? `${descricao.slice(0, 187).trimEnd()}…` : descricao;
      const data = formatarDataConteudo(conteudo.data_post);
      return `
        <article class="pv-conteudos-card">
          <div class="pv-conteudos-card-top">
            <span class="pv-conteudos-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 1 5 16.5z"></path><path d="M8.5 7H16M8.5 10.5H16M8.5 14H13"></path><path d="M5 16.5A2.5 2.5 0 0 0 7.5 19H20v3H7.5A2.5 2.5 0 0 1 5 19.5z"></path>
              </svg>
            </span>
            <span class="pv-conteudos-card-label">EDUCAÇÃO EM SAÚDE</span>
          </div>
          <h3>${escaparHtml(conteudo.titulo || 'Conteúdo educativo')}</h3>
          <p>${escaparHtml(resumo || 'Consulte as informações educativas deste tema e saiba quais sinais observar.')}</p>
          <div class="pv-conteudos-card-footer">
            <span class="pv-conteudos-card-date">${data ? `Atualizado em ${escaparHtml(data)}` : 'Material educativo'}</span>
            <button type="button" class="pv-conteudos-read" data-ler="${escaparHtml(conteudo.id)}">
              <span>Ler conteúdo</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
            </button>
          </div>
        </article>
      `;
    }

    function renderLista() {
      const termo = textoBusca.trim().toLocaleLowerCase('pt-BR');
      const filtrados = lista.filter((item) =>
        `${item.titulo || ''} ${item.descricao || item.texto || ''}`.toLocaleLowerCase('pt-BR').includes(termo)
      );
      contadorEl.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'conteúdo' : 'conteúdos'}`;

      if (!filtrados.length) {
        listaEl.innerHTML = `
          <div class="pv-conteudos-empty">
            <span class="pv-conteudos-empty-icon" aria-hidden="true">⌕</span>
            <h3>Nenhum conteúdo encontrado</h3>
            <p>Tente buscar por outro tema ou sintoma.</p>
            ${termo ? '<button type="button" id="pv-conteudos-limpar">Limpar busca</button>' : ''}
          </div>
        `;
        const limpar = listaEl.querySelector('#pv-conteudos-limpar');
        if (limpar) limpar.addEventListener('click', () => { buscaEl.value = ''; textoBusca = ''; renderLista(); buscaEl.focus(); });
        return;
      }

      listaEl.innerHTML = filtrados.map(cardHtml).join('');
      listaEl.querySelectorAll('[data-ler]').forEach((botao) => {
        botao.addEventListener('click', () => PV.router.navegar('/conteudo/' + botao.dataset.ler));
      });
    }

    async function carregar() {
      listaEl.innerHTML = '<div class="pv-conteudos-loading">Carregando conteúdos...</div>';
      avisoEl.innerHTML = '';
      contadorEl.textContent = 'Carregando...';
      try {
        lista = await PV.db.conteudos.listar({ timeoutMs: 20000 });
        renderLista();
      } catch (e) {
        lista = [];
        contadorEl.textContent = 'Não foi possível carregar';
        listaEl.innerHTML = `
          <div class="pv-conteudos-empty pv-conteudos-empty-error">
            <span class="pv-conteudos-empty-icon" aria-hidden="true">!</span>
            <h3>Não foi possível carregar os conteúdos</h3>
            <p>${escaparHtml(e.message || 'Verifique sua conexão e tente novamente.')}</p>
            <button type="button" id="pv-conteudos-retry">Tentar novamente</button>
          </div>
        `;
        listaEl.querySelector('#pv-conteudos-retry').addEventListener('click', carregar);
      }
    }

    buscaEl.addEventListener('input', () => {
      textoBusca = buscaEl.value;
      renderLista();
    });
    main.querySelector('#btn-recarregar').addEventListener('click', carregar);
    main.querySelector('#pv-conteudos-focus-search').addEventListener('click', () => buscaEl.focus());
    await carregar();
  }

  async function busca(main, ctx) {
    if (ctx.usuario.tipo === 'paciente') {
      await buscaPacienteLovable(main, ctx);
      return;
    }

    const ehAdmin =
      ctx.usuario.tipo === 'administrador';

    let lista = [];
    let textoBusca = '';
    let mensagem = null;
    let form = {
      ...FORM_CONTEUDO_VAZIO,
    };

    main.innerHTML = `
      <div class="tela-busca">

        <div class="busca-container">

          <input
            class="busca-input"
            id="busca-input"
            type="text"
            placeholder="Buscar por tema..."
          >

          <button
            class="icone-lupa"
            id="btn-recarregar"
            type="button"
            aria-label="Atualizar lista"
          >
            ${svgLupa()}
          </button>

        </div>

        ${
          ehAdmin
            ? `
              <button
                class="botao-novo"
                id="btn-novo-conteudo"
                type="button"
              >
                + Novo Conteúdo
              </button>
            `
            : ''
        }

        <div class="aviso-wrap" id="busca-aviso"></div>

        <div id="busca-lista">
          ${carregando()}
        </div>

      </div>

      <div
        class="pv-modal-overlay"
        id="modal-conteudo"
        hidden
      >
        <div class="pv-modal">

          <label class="modal-label">
            Título
          </label>

          <input
            class="modal-input"
            id="mc-titulo"
            type="text"
          >

          <label class="modal-label">
            Descrição
          </label>

          <textarea
            class="modal-input"
            id="mc-descricao"
          ></textarea>

          <label class="modal-label">
            Sinais e Sintomas
            <span class="modal-dica">
              (separe cada item com ; — ex.: Item 1; Item 2; Item 3)
            </span>
          </label>

          <textarea
            class="modal-input"
            id="mc-sinais-sintomas"
            placeholder="Ex.: Dor contínua; Piora ao movimento; Irritabilidade"
          ></textarea>

          <label class="modal-label">
            Sinais de Alerta
            <span class="modal-dica">
              (separe cada item com ; — ex.: Item 1; Item 2; Item 3)
            </span>
          </label>

          <textarea
            class="modal-input"
            id="mc-sinais-alerta"
            placeholder="Ex.: Dor súbita e intensa; Falta de ar; Confusão mental"
          ></textarea>

          <div class="modal-botoes">

            <button
              class="botao-modal botao-cancelar"
              id="mc-cancelar"
              type="button"
            >
              Cancelar
            </button>

            <button
              class="botao-modal botao-salvar"
              id="mc-salvar"
              type="button"
            >
              Salvar
            </button>

          </div>
        </div>
      </div>
    `;

    const listaEl =
      main.querySelector('#busca-lista');

    const avisoEl =
      main.querySelector('#busca-aviso');

    const modalEl =
      main.querySelector('#modal-conteudo');

    function renderLista() {
      const filtrados =
        lista.filter((c) =>
          (c.titulo || '')
            .toLowerCase()
            .includes(textoBusca.toLowerCase()),
        );

      if (!filtrados.length) {
        listaEl.innerHTML = `
          <p class="lista-vazia">
            Nenhum conteúdo encontrado.
          </p>
        `;
      } else {
        listaEl.innerHTML =
          filtrados
            .map((c) =>
              cardConteudoHtml(c, ehAdmin),
            )
            .join('');
      }

      listaEl
        .querySelectorAll('[data-ler]')
        .forEach((b) => {
          b.addEventListener('click', () => {
            PV.router.navegar(
              '/conteudo/' + b.dataset.ler,
            );
          });
        });

      if (ehAdmin) {
        listaEl
          .querySelectorAll('[data-editar]')
          .forEach((b) => {
            b.addEventListener('click', () => {
              abrirModal(
                lista.find(
                  (c) =>
                    String(c.id) ===
                    b.dataset.editar,
                ),
              );
            });
          });

        listaEl
          .querySelectorAll('[data-excluir]')
          .forEach((b) => {
            b.addEventListener('click', () => {
              excluir(b.dataset.excluir);
            });
          });
      }
    }

    async function carregar() {
      listaEl.innerHTML = carregando();

      try {
        lista =
          await PV.db.conteudos.listar();

        renderLista();
      } catch (e) {
        mensagem = {
          tipo: 'erro',
          texto:
            e.message ||
            'Erro ao carregar.',
        };

        avisoEl.innerHTML =
          aviso(mensagem);

        listaEl.innerHTML = '';
      }
    }

    function abrirModal(conteudo) {
      form = conteudo
        ? {
            id: conteudo.id,
            titulo:
              conteudo.titulo || '',
            descricao:
              conteudo.descricao || '',
            SinaisSintomas:
              conteudo.SinaisSintomas || '',
            SinaisAlerta:
              conteudo.SinaisAlerta || '',
          }
        : {
            ...FORM_CONTEUDO_VAZIO,
          };

      main.querySelector(
        '#mc-titulo',
      ).value = form.titulo;

      main.querySelector(
        '#mc-descricao',
      ).value = form.descricao;

      main.querySelector(
        '#mc-sinais-sintomas',
      ).value = form.SinaisSintomas;

      main.querySelector(
        '#mc-sinais-alerta',
      ).value = form.SinaisAlerta;

      modalEl.hidden = false;
    }

    async function salvar() {
      const botao =
        main.querySelector('#mc-salvar');

      botao.disabled = true;
      botao.innerHTML = spinner(true);

      const dados = {
        titulo:
          main.querySelector('#mc-titulo')
            .value,

        descricao:
          main.querySelector('#mc-descricao')
            .value,

        texto:
          main.querySelector('#mc-descricao')
            .value,

        SinaisSintomas:
          main.querySelector(
            '#mc-sinais-sintomas',
          ).value,

        SinaisAlerta:
          main.querySelector(
            '#mc-sinais-alerta',
          ).value,

        data_post:
          new Date()
            .toISOString()
            .split('T')[0],
      };

      try {
        if (form.id) {
          await PV.db.conteudos.atualizar(
            form.id,
            dados,
          );
        } else {
          await PV.db.conteudos.criar(
            dados,
          );
        }

        modalEl.hidden = true;

        mensagem = {
          tipo: 'sucesso',
          texto: 'Conteúdo salvo.',
        };

        avisoEl.innerHTML =
          aviso(mensagem);

        await carregar();
      } catch (e) {
        mensagem = {
          tipo: 'erro',
          texto:
            e.message ||
            'Erro ao salvar.',
        };

        avisoEl.innerHTML =
          aviso(mensagem);
      } finally {
        botao.disabled = false;
        botao.textContent = 'Salvar';
      }
    }

    async function excluir(id) {
      try {
        await PV.db.conteudos.remover(id);

        mensagem = {
          tipo: 'sucesso',
          texto: 'Conteúdo excluído.',
        };

        avisoEl.innerHTML =
          aviso(mensagem);

        await carregar();
      } catch (e) {
        mensagem = {
          tipo: 'erro',
          texto:
            e.message ||
            'Erro ao excluir.',
        };

        avisoEl.innerHTML =
          aviso(mensagem);
      }
    }

    main
      .querySelector('#busca-input')
      .addEventListener('input', (e) => {
        textoBusca =
          e.target.value;

        renderLista();
      });

    main
      .querySelector('#btn-recarregar')
      .addEventListener(
        'click',
        carregar,
      );

    if (ehAdmin) {
      main
        .querySelector(
          '#btn-novo-conteudo',
        )
        .addEventListener(
          'click',
          () => abrirModal(),
        );
    }

    main
      .querySelector('#mc-cancelar')
      .addEventListener(
        'click',
        () => {
          modalEl.hidden = true;
        },
      );

    main
      .querySelector('#mc-salvar')
      .addEventListener(
        'click',
        salvar,
      );

    await carregar();
  }

  /* ======================================================= DashboardAdmin === */

  const PALETA_GRAFICO = [
    '#E4572E',
    '#F3A712',
    '#A8C686',
    '#669BBC',
    '#29335C',
    '#8E6C88',
    '#FF6B6B',
    '#4ECDC4',
    '#C7F464',
    '#556270',
  ];

  const corPorIndice = (i) =>
    PALETA_GRAFICO[
      i % PALETA_GRAFICO.length
    ];

  function calcularEstatisticas(
    registros,
    sintomas,
  ) {
    const nomes = new Map(
      sintomas.map((s) => [
        s.id,
        s.nome_sintoma,
      ]),
    );

    const porSintoma = new Map();

    registros.forEach((r) => {
      const id = Number(r.sintoma_id);

      if (!porSintoma.has(id)) {
        porSintoma.set(id, []);
      }

      porSintoma
        .get(id)
        .push(Number(r.intensidade));
    });

    const ids = [
      ...porSintoma.keys(),
    ];

    const barra = (
      id,
      valor,
      i,
    ) => ({
      label:
        nomes.get(id) ??
        `ID ${id}`,

      value: Number(valor),

      color:
        corPorIndice(i),
    });

    const media = (v) =>
      v.reduce(
        (a, b) => a + b,
        0,
      ) / v.length;

    const variancia = (v) => {
      const m = media(v);

      return (
        v.reduce(
          (s, x) =>
            s + (x - m) ** 2,
          0,
        ) / v.length
      );
    };

    const mediana = (v) => {
      const o = [...v].sort(
        (a, b) => a - b,
      );

      const meio =
        Math.floor(
          o.length / 2,
        );

      return o.length % 2 !== 0
        ? o[meio]
        : (
            o[meio - 1] +
            o[meio]
          ) / 2;
    };

    return {
      media: ids.map(
        (id, i) =>
          barra(
            id,
            +media(
              porSintoma.get(id),
            ).toFixed(1),
            i,
          ),
      ),

      frequencia: ids.map(
        (id, i) =>
          barra(
            id,
            porSintoma.get(id)
              .length,
            i,
          ),
      ),

      mediana: ids.map(
        (id, i) =>
          barra(
            id,
            mediana(
              porSintoma.get(id),
            ),
            i,
          ),
      ),

      variancia: ids.map(
        (id, i) =>
          barra(
            id,
            +variancia(
              porSintoma.get(id),
            ).toFixed(2),
            i,
          ),
      ),

      desvioPadrao: ids.map(
        (id, i) =>
          barra(
            id,
            +Math.sqrt(
              variancia(
                porSintoma.get(id),
              ),
            ).toFixed(2),
            i,
          ),
      ),
    };
  }

  function cardGraficoHtml(
    titulo,
    dados,
  ) {
    const maximo = Math.max(
      ...dados.map(
        (d) => d.value,
      ),
      1,
    );

    return `
      <div class="pv-card-grafico">

        <div class="titulo-grafico">
          ${escaparHtml(titulo)}
        </div>

        <div class="pv-grafico-barras">

          ${dados
            .map(
              (d) => `
                <div class="pv-grafico-coluna-wrap">

                  <div
                    class="pv-grafico-coluna"
                    style="
                      height:${Math.max(
                        (d.value /
                          maximo) *
                          200,
                        d.value >
                        0
                          ? 4
                          : 0,
                      )}px;
                      background:${d.color};
                    "
                  ></div>

                </div>
              `,
            )
            .join('')}

        </div>

        <div class="pv-legenda">

          ${dados
            .map(
              (d) => `
                <div class="pv-legenda-item">

                  <span
                    class="pv-legenda-cor"
                    style="background:${d.color}"
                  ></span>

                  <span>
                    ${escaparHtml(
                      d.label,
                    )}:
                    <b>${d.value}</b>
                  </span>

                </div>
              `,
            )
            .join('')}

        </div>

      </div>
    `;
  }

  function gerenciadorSintomasHtml() {
    return `
      <div
        class="pv-gerenciador"
        id="gerenciador"
      >

        <button
          class="botao-expandir"
          id="ger-toggle"
          type="button"
        >
          Gerenciar sintomas
        </button>

        <div
          class="painel pv-oculto"
          id="ger-painel"
        >

          <div class="subtitulo">
            Lista de sintomas
          </div>

          <div id="ger-lista"></div>

          <button
            class="ver-mais pv-oculto"
            id="ger-vermais"
            type="button"
          >
            Ver mais
          </button>

          <div class="subtitulo">
            Adicionar novo sintoma
          </div>

          <input
            class="input-sintoma"
            id="ger-novo"
            type="text"
            placeholder="Nome do sintoma"
          >

          <button
            class="botao-adicionar"
            id="ger-adicionar"
            type="button"
          >
            Adicionar sintoma
          </button>

        </div>
      </div>
    `;
  }

  function ligarGerenciadorSintomas(
    main,
    onAtualizar,
  ) {
    let aberto = false;
    let verTodos = false;
    let listaSintomas = [];

    const painel =
      main.querySelector(
        '#ger-painel',
      );

    const listaEl =
      main.querySelector(
        '#ger-lista',
      );

    const btnVerMais =
      main.querySelector(
        '#ger-vermais',
      );

    async function carregar() {
      try {
        listaSintomas =
          await PV.db.sintomas.listar();
      } catch {
        listaSintomas = [];
      }

      render();
    }

    function render() {
      const visiveis =
        verTodos
          ? listaSintomas
          : listaSintomas.slice(
              0,
              3,
            );

      listaEl.innerHTML =
        visiveis
          .map(
            (s) => `
              <div class="item-sintoma">

                <span class="nome-sintoma">
                  ${escaparHtml(
                    s.nome_sintoma,
                  )}
                </span>

                <button
                  class="botao-remover"
                  type="button"
                  data-remover="${s.id}"
                >
                  Remover
                </button>

              </div>
            `,
          )
          .join('');

      listaEl
        .querySelectorAll(
          '[data-remover]',
        )
        .forEach((b) => {
          b.addEventListener(
            'click',
            async () => {
              await PV.db.sintomas.remover(
                b.dataset.remover,
              );

              await carregar();
              onAtualizar();
            },
          );
        });

      btnVerMais.classList.toggle(
        'pv-oculto',
        listaSintomas.length <= 3,
      );

      btnVerMais.textContent =
        verTodos
          ? 'Ver menos'
          : 'Ver mais';
    }

    main
      .querySelector('#ger-toggle')
      .addEventListener(
        'click',
        () => {
          aberto = !aberto;

          main.querySelector(
            '#ger-toggle',
          ).textContent = aberto
            ? 'Fechar gerenciamento de sintomas'
            : 'Gerenciar sintomas';

          painel.classList.toggle(
            'pv-oculto',
            !aberto,
          );

          if (aberto) {
            carregar();
          }
        },
      );

    btnVerMais.addEventListener(
      'click',
      () => {
        verTodos = !verTodos;
        render();
      },
    );

    main
      .querySelector('#ger-adicionar')
      .addEventListener(
        'click',
        async () => {
          const campo =
            main.querySelector(
              '#ger-novo',
            );

          if (!campo.value.trim()) {
            return;
          }

          await PV.db.sintomas.criar(
            campo.value.trim(),
          );

          campo.value = '';

          await carregar();
          onAtualizar();
        },
      );
  }

  async function dashboardAdmin(
    main,
    ctx,
  ) {
    main.innerHTML =
      carregando(
        'Carregando...',
      );

    let registros = [];
    let sintomas = [];
    let erro = null;

    try {
      [
        registros,
        sintomas,
      ] = await Promise.all([
        PV.db.registros.listar(),
        PV.db.sintomas.listar(),
      ]);
    } catch (e) {
      erro =
        e.message ||
        'Não foi possível carregar os dados.';
    }

    const estat =
      calcularEstatisticas(
        registros,
        sintomas,
      );

    const temDados =
      registros.length > 0;

    main.innerHTML = `
      <div class="tela-dashboard">

        <h1 class="titulo">
          Dashboard
        </h1>

        ${
          erro
            ? `
              <p class="erro-texto">
                ${escaparHtml(erro)}
              </p>
            `
            : ''
        }

        ${
          temDados
            ? `
              ${cardGraficoHtml(
                'Média de intensidade',
                estat.media,
              )}

              ${cardGraficoHtml(
                'Frequência de registros',
                estat.frequencia,
              )}

              ${cardGraficoHtml(
                'Mediana da intensidade',
                estat.mediana,
              )}

              ${cardGraficoHtml(
                'Variância da intensidade',
                estat.variancia,
              )}

              ${cardGraficoHtml(
                'Desvio padrão da intensidade',
                estat.desvioPadrao,
              )}
            `
            : `
              <p class="vazio">
                Ainda não há registros de sintomas.
              </p>
            `
        }

        ${gerenciadorSintomasHtml()}

      </div>
    `;

    ligarGerenciadorSintomas(
      main,
      () =>
        PV.router.renderizar(),
    );
  }

  PV.screens.home = home;
  PV.screens.contato = contato;
  PV.screens.busca = busca;
  PV.screens.dashboardAdmin =
    dashboardAdmin;
})();
