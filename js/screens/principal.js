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

  /* PaliVida: cuidador home v1 */
  function iconeHomeAcompanhante(nome) {
    const caminhos = {
      inicio: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
      vinculos: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>',
      sintomas: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
      conteudos: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/>',
      perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      busca: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
      coracao: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
      sair: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${caminhos[nome] || ''}</svg>`;
  }

  function iniciaisAcompanhante(nome) {
    const partes = String(nome || '').trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return 'A';
    return (partes.length === 1
      ? partes[0].slice(0, 2)
      : partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
    ).toLocaleUpperCase('pt-BR');
  }

  async function homeAcompanhanteLovable(main, ctx) {
    main.classList.remove('pv-sem-scroll');
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }

    main.innerHTML = `
      <div class="pv-cuidador-home-layout">
        <aside class="pv-cuidador-sidebar" aria-label="Navegação do acompanhante">
          <div class="pv-cuidador-sidebar-top">
            <div class="pv-cuidador-brand">
              <a href="#/home" aria-label="PaliVida — início">
                <img src="assets/img/logo-completo.png" alt="PaliVida">
              </a>
            </div>
            <div class="pv-cuidador-nav-label">MEU CUIDADO</div>
            <nav class="pv-cuidador-nav">
              <button type="button" class="pv-cuidador-nav-item active" data-cuidador-rota="/home" aria-current="page">
                ${iconeHomeAcompanhante('inicio')}<span>Início</span>
              </button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/vinculos">
                ${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span>
              </button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/busca">
                ${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span>
              </button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/perfil">
                ${iconeHomeAcompanhante('perfil')}<span>Perfil</span>
              </button>
            </nav>
          </div>
          <div class="pv-cuidador-sidebar-footer">
            <div class="pv-cuidador-sidebar-profile">
              <span class="pv-cuidador-avatar" id="pv-cuidador-sidebar-avatar">A</span>
              <span class="pv-cuidador-profile-text">
                <strong id="pv-cuidador-sidebar-name">Acompanhante</strong>
                <small>Acompanhante</small>
              </span>
            </div>
            <button type="button" class="pv-cuidador-logout" data-sair>
              ${iconeHomeAcompanhante('sair')}<span>Sair</span>
            </button>
          </div>
        </aside>

        <section class="pv-cuidador-workspace">
          <header class="pv-cuidador-topbar">
            <strong>Meu cuidado</strong>
            <div class="pv-cuidador-topbar-actions">
              <span>Protótipo demonstrativo</span>
              <button type="button" class="pv-cuidador-topbar-icon" data-cuidador-rota="/busca" aria-label="Buscar conteúdos">
                ${iconeHomeAcompanhante('busca')}
              </button>
            </div>
          </header>

          <main class="pv-cuidador-content">
            <section class="pv-cuidador-heading">
              <span class="pv-cuidador-eyebrow">ÁREA DO ACOMPANHANTE</span>
              <h1 id="pv-cuidador-boas-vindas">Olá!</h1>
              <p>Acompanhe as informações permitidas dos pacientes vinculados ao seu perfil.</p>
            </section>

            <div class="pv-cuidador-notice" id="pv-cuidador-notice" hidden></div>

            <section class="pv-cuidador-overview-grid">
              <div class="pv-cuidador-card pv-cuidador-patients-card">
                <div class="pv-cuidador-card-heading">
                  <div>
                    <span class="pv-cuidador-card-eyebrow">SEU ACOMPANHAMENTO</span>
                    <h2>Pacientes vinculados</h2>
                    <p>Consulte os vínculos associados à sua conta.</p>
                  </div>
                  <span class="pv-cuidador-card-icon">${iconeHomeAcompanhante('vinculos')}</span>
                </div>
                <div id="pv-cuidador-pacientes" class="pv-cuidador-patients-list">
                  <div class="pv-cuidador-empty">Carregando seus vínculos...</div>
                </div>
                <div class="pv-cuidador-card-actions">
                  <button type="button" class="pv-cuidador-button primary" data-cuidador-rota="/vinculos">Gerenciar vínculos</button>
                  <button type="button" class="pv-cuidador-button secondary" data-cuidador-rota="/perfil">Ver meu perfil</button>
                </div>
              </div>

              <aside class="pv-cuidador-support-card">
                <span class="pv-cuidador-support-icon">${iconeHomeAcompanhante('coracao')}</span>
                <span class="pv-cuidador-card-eyebrow">CUIDAR TAMBÉM É ACOMPANHAR</span>
                <h2>Você também precisa de apoio.</h2>
                <p>Consulte conteúdos educativos para apoiar sua rotina de cuidado.</p>
                <button type="button" class="pv-cuidador-text-button" data-cuidador-rota="/busca">Ver conteúdos ${iconeHomeAcompanhante('busca')}</button>
              </aside>
            </section>

            <section class="pv-cuidador-shortcuts">
              <button type="button" class="pv-cuidador-shortcut" data-cuidador-rota="/vinculos">
                <span class="pv-cuidador-shortcut-icon">${iconeHomeAcompanhante('vinculos')}</span>
                <span><strong>Vínculos</strong><small>Gerencie os pacientes vinculados à sua conta.</small></span>
                <span class="pv-cuidador-arrow">›</span>
              </button>
              <button type="button" class="pv-cuidador-shortcut" data-cuidador-rota="/busca">
                <span class="pv-cuidador-shortcut-icon">${iconeHomeAcompanhante('conteudos')}</span>
                <span><strong>Conteúdos e orientações</strong><small>Informações para apoiar o cuidado no dia a dia.</small></span>
                <span class="pv-cuidador-arrow">›</span>
              </button>
            </section>

            <section class="pv-cuidador-reassurance">
              <span>${iconeHomeAcompanhante('coracao')}</span>
              <div><strong>Você não está sozinho.</strong><p>O PaliVida está aqui para apoiar sua jornada de cuidado.</p></div>
            </section>
          </main>
        </section>

        <nav class="pv-cuidador-mobile-nav" aria-label="Navegação principal">
          <button class="active" type="button" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
          <button type="button" data-cuidador-rota="/vinculos">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
              <button type="button" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
          <button type="button" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
          <button type="button" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
        </nav>
      </div>
    `;

    main.querySelectorAll('[data-cuidador-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.cuidadorRota));
    });
    PV.ui.ligarLogout(main);

    const nomeEl = main.querySelector('#pv-cuidador-sidebar-name');
    const avatarEl = main.querySelector('#pv-cuidador-sidebar-avatar');
    const saudacaoEl = main.querySelector('#pv-cuidador-boas-vindas');
    const pacientesEl = main.querySelector('#pv-cuidador-pacientes');
    const noticeEl = main.querySelector('#pv-cuidador-notice');

    const resultados = await Promise.allSettled([
      PV.db.acompanhantes.buscar(ctx.usuario.id),
      PV.db.acompanhantes.pacientes(ctx.usuario.id),
    ]);
    if (!main.isConnected) return;

    const perfilResult = resultados[0];
    const pacientesResult = resultados[1];
    let nome = 'Acompanhante';
    if (perfilResult.status === 'fulfilled' && perfilResult.value) {
      const perfil = perfilResult.value;
      nome = perfil.nome_social || perfil.nome_completo || 'Acompanhante';
    } else if (ctx.usuario.email) {
      nome = ctx.usuario.email.split('@')[0] || nome;
    }
    nomeEl.textContent = nome;
    avatarEl.textContent = iniciaisAcompanhante(nome);
    saudacaoEl.textContent = `Olá, ${nome}`;

    if (pacientesResult.status !== 'fulfilled') {
      pacientesEl.innerHTML = '<div class="pv-cuidador-empty">Não foi possível carregar os vínculos agora. Acesse a seção Vínculos para tentar novamente.</div>';
      noticeEl.hidden = false;
      noticeEl.textContent = pacientesResult.reason?.message || 'Não foi possível consultar os pacientes vinculados.';
      return;
    }

    const pacientes = pacientesResult.value || [];
    if (!pacientes.length) {
      pacientesEl.innerHTML = `
        <div class="pv-cuidador-empty-state">
          <span class="pv-cuidador-empty-icon">${iconeHomeAcompanhante('vinculos')}</span>
          <strong>Nenhum paciente vinculado ainda</strong>
          <p>Use a área de vínculos para conectar o código de um paciente à sua conta.</p>
        </div>`;
      return;
    }

    pacientesEl.innerHTML = pacientes.map((paciente) => {
      const nomePaciente = paciente.nome_social || paciente.nome || 'Paciente vinculado';
      const email = paciente.email || '';
      return `
        <article class="pv-cuidador-patient-row">
          <span class="pv-cuidador-patient-avatar">${escaparHtml(iniciaisAcompanhante(nomePaciente))}</span>
          <div class="pv-cuidador-patient-info">
            <strong>${escaparHtml(nomePaciente)}</strong>
            <small>${email ? escaparHtml(email) + ' · ' : ''}Vínculo ativo</small>
          </div>
          <span class="pv-cuidador-status">Ativo</span>
        </article>`;
    }).join('');
  }

  async function home(main, ctx) {
    if (ctx.usuario.tipo === 'paciente') {
      homePaciente(main, ctx);
      return;
    }

    if (ctx.usuario.tipo === 'acompanhante') {
      await homeAcompanhanteLovable(main, ctx);
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

  /* PaliVida: cuidador vínculos v1 */
  async function telaVinculosAcompanhante(main, ctx) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }

    main.classList.remove('pv-sem-scroll', 'pv-cuidador-vinculos-main');
    main.classList.add('pv-cuidador-vinculos-main');
    main.innerHTML = `
      <div class="pv-cuidador-home-layout pv-cuidador-vinculos-layout">
        <aside class="pv-cuidador-sidebar" aria-label="Navegação do acompanhante">
          <div class="pv-cuidador-sidebar-top">
            <div class="pv-cuidador-brand">
              <a href="#/home" aria-label="PaliVida — início"><img src="assets/img/logo-completo.png" alt="PaliVida"></a>
            </div>
            <div class="pv-cuidador-nav-label">MEU CUIDADO</div>
            <nav class="pv-cuidador-nav">
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
              <button type="button" class="pv-cuidador-nav-item active" data-cuidador-rota="/vinculos" aria-current="page">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
            </nav>
          </div>
          <div class="pv-cuidador-sidebar-footer">
            <div class="pv-cuidador-sidebar-profile">
              <span class="pv-cuidador-avatar" id="pv-cuidador-vinculos-avatar" aria-hidden="true">A</span>
              <span class="pv-cuidador-profile-text"><strong id="pv-cuidador-vinculos-nome">Acompanhante</strong><small>Acompanhante</small></span>
            </div>
            <button type="button" class="pv-cuidador-logout" data-sair>${iconeHomeAcompanhante('sair')}<span>Sair</span></button>
          </div>
        </aside>

        <section class="pv-cuidador-workspace">
          <header class="pv-cuidador-topbar">
            <strong>Meu cuidado</strong>
            <div class="pv-cuidador-topbar-actions"><span>Protótipo demonstrativo</span><button type="button" class="pv-cuidador-topbar-icon" data-cuidador-rota="/busca" aria-label="Buscar conteúdos">${iconeHomeAcompanhante('busca')}</button></div>
          </header>

          <main class="pv-cuidador-content pv-cuidador-vinculos-content">
            <section class="pv-cuidador-heading">
              <span class="pv-cuidador-eyebrow">ACOMPANHANTE</span>
              <h1>Pacientes vinculados</h1>
              <p>Vínculos disponíveis para consulta neste perfil.</p>
            </section>

            <div class="pv-cuidador-notice" id="pv-cuidador-vinculos-aviso" hidden role="status"></div>

            <section class="pv-cuidador-vinculos-list" id="pv-cuidador-vinculos-list" aria-live="polite">
              <div class="pv-cuidador-empty">Carregando seus vínculos...</div>
            </section>

            <p class="pv-cuidador-vinculos-note">As informações exibidas dependem dos vínculos associados à sua conta. O acompanhamento é somente para consulta; esta tela não registra sintomas em nome do cuidador.</p>

            <section class="pv-cuidador-card pv-cuidador-link-create-card">
              <div class="pv-cuidador-card-heading">
                <div><span class="pv-cuidador-card-eyebrow">NOVO VÍNCULO</span><h2>Vincular paciente</h2><p>Informe o código do paciente para solicitar o vínculo à sua conta.</p></div>
                <span class="pv-cuidador-card-icon">${iconeHomeAcompanhante('vinculos')}</span>
              </div>
              <form id="pv-cuidador-vincular-form" class="pv-cuidador-vincular-form">
                <label for="pv-cuidador-codigo-paciente">Código do paciente</label>
                <div class="pv-cuidador-vincular-row">
                  <input id="pv-cuidador-codigo-paciente" name="codigoPaciente" type="number" min="1" step="1" inputmode="numeric" placeholder="Digite o código do paciente" required>
                  <button class="pv-cuidador-button primary" id="pv-cuidador-vincular-submit" type="submit">Vincular paciente</button>
                </div>
                <p>O vínculo será validado pelo serviço de dados existente. Se o código não for válido ou o vínculo já existir, a mensagem de erro será exibida aqui.</p>
              </form>
            </section>

            <nav class="pv-cuidador-mobile-nav" aria-label="Navegação principal">
              <button type="button" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
              <button type="button" class="active" data-cuidador-rota="/vinculos" aria-current="page">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
              <button type="button" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
              <button type="button" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
              <button type="button" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
            </nav>
          </main>
        </section>
      </div>`;

    main.querySelectorAll('[data-cuidador-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.cuidadorRota));
    });
    PV.ui.ligarLogout(main);

    const nomeEl = main.querySelector('#pv-cuidador-vinculos-nome');
    const avatarEl = main.querySelector('#pv-cuidador-vinculos-avatar');
    const avisoEl = main.querySelector('#pv-cuidador-vinculos-aviso');
    const listaEl = main.querySelector('#pv-cuidador-vinculos-list');
    const formEl = main.querySelector('#pv-cuidador-vincular-form');
    const codigoEl = main.querySelector('#pv-cuidador-codigo-paciente');
    const submitEl = main.querySelector('#pv-cuidador-vincular-submit');
    let pacientes = [];

    const mostrarAviso = (texto, tipo = 'info') => {
      avisoEl.hidden = !texto;
      avisoEl.className = `pv-cuidador-notice${tipo === 'error' ? ' is-error' : tipo === 'success' ? ' is-success' : ''}`;
      avisoEl.textContent = texto || '';
    };

    function renderizarPacientes() {
      if (!pacientes.length) {
        listaEl.innerHTML = `
          <div class="pv-cuidador-vinculos-empty">
            <span class="pv-cuidador-empty-icon">${iconeHomeAcompanhante('vinculos')}</span>
            <strong>Nenhum paciente vinculado ainda</strong>
            <p>Quando houver um vínculo associado à sua conta, o paciente aparecerá aqui. Você também pode usar o formulário abaixo para vincular um código.</p>
          </div>`;
        return;
      }

      listaEl.innerHTML = pacientes.map((paciente) => {
        const id = Number(paciente.id);
        const nomePaciente = paciente.nome_social || paciente.nome || 'Paciente vinculado';
        return `
          <article class="pv-cuidador-vinculo-card" data-vinculo-id="${id}">
            <div class="pv-cuidador-vinculo-summary">
              <span class="pv-cuidador-patient-avatar">${escaparHtml(iniciaisAcompanhante(nomePaciente))}</span>
              <div class="pv-cuidador-patient-info"><strong>${escaparHtml(nomePaciente)}</strong><small>Vínculo ativo · Paciente acompanhado</small></div>
              <span class="pv-cuidador-status">Ativo</span>
            </div>
            <div class="pv-cuidador-vinculo-actions">
              <button class="pv-cuidador-button primary" type="button" data-consultar-vinculo="${id}">Ver acompanhamento permitido</button>
              <button class="pv-cuidador-button secondary" type="button" data-detalhes-vinculo="${id}">Detalhes do vínculo</button>
            </div>
            <div class="pv-cuidador-vinculo-detail" id="pv-cuidador-vinculo-detail-${id}" hidden></div>
          </article>`;
      }).join('');

      listaEl.querySelectorAll('[data-consultar-vinculo], [data-detalhes-vinculo]').forEach((botao) => {
        botao.addEventListener('click', async () => {
          const id = Number(botao.dataset.consultarVinculo || botao.dataset.detalhesVinculo);
          const detail = main.querySelector(`#pv-cuidador-vinculo-detail-${id}`);
          if (!detail) return;
          if (!detail.hidden) {
            detail.hidden = true;
            return;
          }
          detail.hidden = false;
          detail.innerHTML = '<div class="pv-cuidador-empty">Carregando informações autorizadas...</div>';
          botao.disabled = true;
          try {
            const paciente = await PV.db.pacientes.buscar(id);
            if (!main.isConnected) return;
            const cidade = [paciente.cidade, paciente.estado].filter(Boolean).join(' — ');
            const itens = [
              ['E-mail', paciente.email],
              ['Cidade / UF', cidade],
              ['Unidade de saúde', paciente.unidades_de_saude],
              ['Contato de emergência', paciente.contato_emergencia],
            ].filter((item) => String(item[1] || '').trim());
            detail.innerHTML = itens.length
              ? `<div class="pv-cuidador-vinculo-detail-grid">${itens.map(([label, value]) => `<div><small>${escaparHtml(label)}</small><strong>${escaparHtml(value)}</strong></div>`).join('')}</div><p>Para manter o escopo desta etapa, os registros de sintomas serão organizados em uma tela de consulta própria na próxima etapa.</p>`
              : '<p>O cadastro não contém informações adicionais de contato ou referência para exibir.</p>';
          } catch (erro) {
            detail.innerHTML = `<p class="pv-cuidador-inline-error">${escaparHtml(erro.message || 'Não foi possível carregar as informações deste vínculo.')}</p>`;
          } finally {
            botao.disabled = false;
          }
        });
      });
    }

    const resultados = await Promise.allSettled([
      PV.db.acompanhantes.buscar(ctx.usuario.id),
      PV.db.acompanhantes.pacientes(ctx.usuario.id),
    ]);
    if (!main.isConnected) return;

    const perfilResult = resultados[0];
    const pacientesResult = resultados[1];
    let nome = 'Acompanhante';
    if (perfilResult.status === 'fulfilled' && perfilResult.value) {
      nome = perfilResult.value.nome_social || perfilResult.value.nome_completo || 'Acompanhante';
    } else if (ctx.usuario.email) {
      nome = ctx.usuario.email.split('@')[0] || nome;
    }
    nomeEl.textContent = nome;
    avatarEl.textContent = iniciaisAcompanhante(nome);

    if (pacientesResult.status === 'fulfilled') {
      pacientes = pacientesResult.value || [];
      renderizarPacientes();
    } else {
      listaEl.innerHTML = `<div class="pv-cuidador-vinculos-empty"><strong>Não foi possível carregar os vínculos</strong><p>${escaparHtml(pacientesResult.reason?.message || 'Tente novamente em instantes.')}</p></div>`;
    }

    formEl.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      mostrarAviso('');
      const codigo = Number(codigoEl.value);
      if (!Number.isSafeInteger(codigo) || codigo <= 0) {
        mostrarAviso('Informe um código de paciente válido.', 'error');
        codigoEl.focus();
        return;
      }
      if (pacientes.some((paciente) => Number(paciente.id) === codigo)) {
        mostrarAviso('Este paciente já está vinculado à sua conta.', 'error');
        return;
      }
      submitEl.disabled = true;
      submitEl.textContent = 'Vinculando...';
      try {
        await PV.db.vinculos.criar(codigo);
        pacientes = await PV.db.acompanhantes.pacientes(ctx.usuario.id);
        renderizarPacientes();
        codigoEl.value = '';
        mostrarAviso('Vínculo criado com sucesso.', 'success');
      } catch (erro) {
        mostrarAviso(erro.message || 'Não foi possível criar o vínculo. Confira o código e tente novamente.', 'error');
      } finally {
        submitEl.disabled = false;
        submitEl.textContent = 'Vincular paciente';
      }
    });
  }

  /* PaliVida: cuidador sintomas consulta v1 */
  async function telaSintomasAcompanhante(main, ctx) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }
    main.classList.remove('pv-sem-scroll');
    main.classList.remove('pv-cuidador-sintomas-main');
    main.classList.add('pv-cuidador-sintomas-main');

    const esc = (valor) => PV.ui.escaparHtml(String(valor ?? ''));
    const nomeNormalizado = (valor) => String(valor || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const dataValor = (registro) => registro?.data_registro || registro?.created_at || registro?.data || '';
    const timestamp = (registro) => {
      const valor = dataValor(registro);
      const numero = valor ? new Date(valor).getTime() : 0;
      return Number.isFinite(numero) ? numero : 0;
    };
    const formatarData = (valor, incluirHora = true) => {
      if (!valor) return 'Data não informada';
      const data = new Date(valor);
      if (Number.isNaN(data.getTime())) return esc(valor);
      return data.toLocaleString('pt-BR', incluirHora
        ? { dateStyle: 'short', timeStyle: 'short' }
        : { dateStyle: 'short' });
    };
    const iniciais = (nome) => {
      const partes = String(nome || '').trim().split(/\s+/).filter(Boolean);
      if (!partes.length) return 'A';
      return (partes.length === 1 ? partes[0].slice(0, 2) : partes[0][0] + partes[partes.length - 1][0]).toLocaleUpperCase('pt-BR');
    };
    const paraLista = (valor) => {
      if (Array.isArray(valor)) return valor.map((item) => String(item).trim()).filter(Boolean);
      return String(valor || '').split(/[;\n]+/).map((item) => item.trim()).filter(Boolean);
    };
    const hashSintomas = (parametros = {}) => {
      const query = new URLSearchParams();
      Object.entries(parametros).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') query.set(chave, String(valor));
      });
      const texto = query.toString();
      PV.router.navegar('/sintomas' + (texto ? '?' + texto : ''));
    };

    const viewSolicitada = ['detalhe', 'historico'].includes(ctx.query.view) ? ctx.query.view : 'lista';
    const idSintomaSolicitado = Number(ctx.query.sintoma) || 0;
    main.innerHTML = `
      <div class="pv-cuidador-home-layout pv-cuidador-sintomas-layout">
        <aside class="pv-cuidador-sidebar" aria-label="Navegação do acompanhante">
          <div class="pv-cuidador-sidebar-top">
            <div class="pv-cuidador-brand"><a href="#/home" aria-label="PaliVida — início"><img src="assets/img/logo-completo.png" alt="PaliVida"></a></div>
            <div class="pv-cuidador-nav-label">MEU CUIDADO</div>
            <nav class="pv-cuidador-nav">
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/vinculos">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
              <button type="button" class="pv-cuidador-nav-item active" data-cuidador-rota="/sintomas" aria-current="page">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
              <button type="button" class="pv-cuidador-nav-item" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
            </nav>
          </div>
          <div class="pv-cuidador-sidebar-footer">
            <div class="pv-cuidador-sidebar-profile"><span class="pv-cuidador-avatar" id="pv-cuid-sintomas-avatar">A</span><span class="pv-cuidador-profile-text"><strong id="pv-cuid-sintomas-nome">Acompanhante</strong><small>Acompanhante</small></span></div>
            <button type="button" class="pv-cuidador-logout" data-sair>${iconeHomeAcompanhante('sair')}<span>Sair</span></button>
          </div>
        </aside>
        <section class="pv-cuidador-workspace">
          <header class="pv-cuidador-topbar"><strong>Meu cuidado</strong><div class="pv-cuidador-topbar-actions"><span>Protótipo demonstrativo</span><button type="button" class="pv-cuidador-topbar-icon" data-cuidador-rota="/busca" aria-label="Buscar conteúdos">${iconeHomeAcompanhante('busca')}</button></div></header>
          <div class="pv-cuidador-content pv-cuidador-sintomas-content">
            <div class="pv-cuidador-heading"><span class="pv-cuidador-eyebrow">ACOMPANHAMENTO</span><h1 id="pv-cuid-sintomas-titulo">Sintomas do paciente</h1><p id="pv-cuid-sintomas-subtitulo">Consulte os sintomas e as intensidades informadas pelos pacientes vinculados à sua conta.</p></div>
            <div id="pv-cuid-sintomas-notice" class="pv-cuidador-notice" hidden></div>
            <div id="pv-cuid-sintomas-loading" class="pv-cuidador-symptom-loading"><span class="pv-cuidador-symptom-spinner" aria-hidden="true"></span>Carregando informações autorizadas...</div>
            <div id="pv-cuid-sintomas-body" hidden></div>
          </div>
        </section>
        <nav class="pv-cuidador-mobile-nav" aria-label="Navegação principal">
          <button type="button" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
          <button type="button" data-cuidador-rota="/vinculos">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
          <button type="button" class="active" data-cuidador-rota="/sintomas" aria-current="page">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
          <button type="button" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
          <button type="button" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
        </nav>
      </div>`;

    main.querySelectorAll('[data-cuidador-rota]').forEach((botao) => botao.addEventListener('click', () => PV.router.navegar(botao.dataset.cuidadorRota)));
    PV.ui.ligarLogout(main);

    const nomeEl = main.querySelector('#pv-cuid-sintomas-nome');
    const avatarEl = main.querySelector('#pv-cuid-sintomas-avatar');
    const loadingEl = main.querySelector('#pv-cuid-sintomas-loading');
    const bodyEl = main.querySelector('#pv-cuid-sintomas-body');
    const noticeEl = main.querySelector('#pv-cuid-sintomas-notice');
    const tituloEl = main.querySelector('#pv-cuid-sintomas-titulo');
    const subtituloEl = main.querySelector('#pv-cuid-sintomas-subtitulo');
    const mostrarAviso = (mensagem, erro = false) => {
      noticeEl.hidden = !mensagem;
      noticeEl.className = `pv-cuidador-notice${erro ? ' is-error' : ''}`;
      noticeEl.textContent = mensagem || '';
    };

    const resultados = await Promise.allSettled([
      PV.db.acompanhantes.buscar(ctx.usuario.id),
      PV.db.acompanhantes.pacientes(ctx.usuario.id),
      PV.db.sintomas.listar(),
      PV.db.registros.listar(),
    ]);
    if (!main.isConnected) return;
    const [perfilResult, pacientesResult, sintomasResult, registrosResult] = resultados;
    const perfil = perfilResult.status === 'fulfilled' ? perfilResult.value : null;
    const pacientes = pacientesResult.status === 'fulfilled' ? (pacientesResult.value || []) : [];
    const sintomas = sintomasResult.status === 'fulfilled' ? (sintomasResult.value || []) : [];
    const registrosPermitidos = registrosResult.status === 'fulfilled' ? (registrosResult.value || []) : [];
    const nomeCuidador = perfil?.nome_social || perfil?.nome_completo || (ctx.usuario.email ? ctx.usuario.email.split('@')[0] : 'Acompanhante') || 'Acompanhante';
    nomeEl.textContent = nomeCuidador;
    avatarEl.textContent = iniciais(nomeCuidador);
    loadingEl.hidden = true;
    bodyEl.hidden = false;

    if (pacientesResult.status === 'rejected') {
      mostrarAviso(pacientesResult.reason?.message || 'Não foi possível carregar os vínculos autorizados. Tente novamente.', true);
    }
    if (sintomasResult.status === 'rejected' || registrosResult.status === 'rejected') {
      mostrarAviso('Não foi possível carregar todos os dados de acompanhamento. Atualize a página para tentar novamente.', true);
    }

    const queryPatientId = Number(ctx.query.paciente) || 0;
    const pacienteSelecionado = pacientes.find((paciente) => Number(paciente.id) === queryPatientId) || pacientes[0] || null;
    // Restrict everything displayed below to a patient returned by the caregiver's own authorized links.
    const idPaciente = pacienteSelecionado ? Number(pacienteSelecionado.id) : 0;
    const nomePaciente = pacienteSelecionado ? (pacienteSelecionado.nome_social || pacienteSelecionado.nome || 'Paciente vinculado') : '';
    const registrosPaciente = registrosPermitidos
      .filter((registro) => Number(registro.paciente_id) === idPaciente)
      .slice()
      .sort((a, b) => timestamp(b) - timestamp(a));
    const mapaSintomas = new Map(sintomas.map((sintoma) => [Number(sintoma.id), sintoma]));
    const mapaUltimoRegistro = new Map();
    registrosPaciente.forEach((registro) => {
      const id = Number(registro.sintoma_id);
      if (id && !mapaUltimoRegistro.has(id)) mapaUltimoRegistro.set(id, registro);
    });

    const seletorPaciente = () => `
      <section class="pv-cuidador-symptom-patient-picker">
        <div><label for="pv-cuid-sintomas-paciente">Paciente em acompanhamento</label><p>Os dados exibidos pertencem ao paciente selecionado.</p></div>
        <select id="pv-cuid-sintomas-paciente" ${pacientes.length ? '' : 'disabled'}>
          ${pacientes.map((paciente) => `<option value="${Number(paciente.id)}" ${Number(paciente.id) === idPaciente ? 'selected' : ''}>${esc(paciente.nome_social || paciente.nome || 'Paciente vinculado')}</option>`).join('')}
        </select>
      </section>`;

    const listaSemVinculos = () => `
      <section class="pv-cuidador-symptom-empty">
        <span class="pv-cuidador-empty-icon">${iconeHomeAcompanhante('vinculos')}</span>
        <h2>Nenhum paciente vinculado</h2>
        <p>Para consultar sintomas e histórico, primeiro é necessário ter um vínculo com um paciente.</p>
        <button type="button" class="pv-cuidador-button primary" data-cuid-vinculos>Gerenciar vínculos</button>
      </section>`;

    function nomeDoSintoma(registro) {
      return mapaSintomas.get(Number(registro.sintoma_id))?.nome_sintoma || 'Sintoma';
    }
    function navegarParaHistorico(idSintoma = 0) {
      hashSintomas({ paciente: idPaciente, view: 'historico', sintoma: idSintoma || '' });
    }
    function ligarSeletor() {
      const seletor = bodyEl.querySelector('#pv-cuid-sintomas-paciente');
      if (seletor) seletor.addEventListener('change', () => hashSintomas({ paciente: seletor.value }));
    }
    function ligarBotaoVinculos() {
      bodyEl.querySelectorAll('[data-cuid-vinculos]').forEach((botao) => botao.addEventListener('click', () => PV.router.navegar('/vinculos')));
    }

    if (!idPaciente) {
      tituloEl.textContent = 'Sintomas dos pacientes';
      subtituloEl.textContent = 'Consulte os registros e as intensidades informadas pelos pacientes vinculados.';
      bodyEl.innerHTML = listaSemVinculos();
      ligarBotaoVinculos();
      return;
    }

    tituloEl.textContent = viewSolicitada === 'historico' ? 'Histórico de sintomas' : viewSolicitada === 'detalhe' ? 'Acompanhamento de sintomas' : 'Sintomas de ' + nomePaciente;
    subtituloEl.textContent = viewSolicitada === 'historico'
      ? 'Consulte os registros informados, em ordem cronológica.'
      : viewSolicitada === 'detalhe'
        ? 'Informações educativas e histórico do sintoma selecionado.'
        : 'Consulte os sintomas e as intensidades informadas para este paciente.';

    let conteudos = [];
    if (viewSolicitada === 'detalhe') {
      try { conteudos = await PV.db.conteudos.listar({ timeoutMs: 8000 }); } catch (_) { /* conteúdo educativo é opcional; histórico continua disponível */ }
      if (!main.isConnected) return;
    }

    let html = seletorPaciente();

    if (viewSolicitada === 'lista') {
      html += `
        <div class="pv-cuidador-symptom-toolbar">
          <div class="pv-cuidador-symptom-search"><span aria-hidden="true">⌕</span><input id="pv-cuid-sintoma-busca" type="search" placeholder="Buscar sintoma" aria-label="Buscar sintoma"></div>
          <button type="button" class="pv-cuidador-button secondary" data-cuid-historico>${iconeHomeAcompanhante('sintomas')} Histórico</button>
        </div>
        <div class="pv-cuidador-symptom-section-title"><h2>Todos os sintomas</h2><span>${sintomas.length} sintomas</span></div>
        <div class="pv-cuidador-symptom-grid" id="pv-cuid-sintoma-grid">
          ${sintomas.length ? sintomas.map((sintoma) => {
            const id = Number(sintoma.id);
            const nome = sintoma.nome_sintoma || 'Sintoma';
            const ultimo = mapaUltimoRegistro.get(id);
            return `<button type="button" class="pv-cuidador-symptom-card" data-cuid-sintoma="${id}" data-cuid-nome="${esc(nomeNormalizado(nome))}"><span class="pv-cuidador-symptom-abbr">${esc(iniciais(nome))}</span><span class="pv-cuidador-symptom-copy"><strong>${esc(nome)}</strong><small>Informações e acompanhamento</small>${ultimo ? `<em>Último registro: ${esc(ultimo.intensidade)}/10</em>` : ''}</span><span class="pv-cuidador-symptom-arrow" aria-hidden="true">›</span></button>`;
          }).join('') : '<div class="pv-cuidador-symptom-empty"><h2>Nenhum sintoma cadastrado</h2><p>Não há sintomas disponíveis para consulta neste momento.</p></div>'}
        </div>
        <p class="pv-cuidador-symptom-readonly-note">Consulta somente leitura: os registros são exibidos conforme o paciente informou. Nenhum registro será criado ou modificado nesta tela.</p>`;
    } else if (viewSolicitada === 'detalhe') {
      const sintoma = sintomas.find((item) => Number(item.id) === idSintomaSolicitado);
      if (!sintoma) {
        html += `<section class="pv-cuidador-symptom-empty"><h2>Sintoma não encontrado</h2><p>Selecione um sintoma da lista para consultar seus detalhes.</p><button type="button" class="pv-cuidador-button secondary" data-cuid-lista>Voltar aos sintomas</button></section>`;
      } else {
        const nome = sintoma.nome_sintoma || 'Sintoma';
        const conteudo = conteudos.find((item) => nomeNormalizado(item.titulo) === nomeNormalizado(nome)) || null;
        const descricao = conteudo?.descricao || conteudo?.texto || '';
        const sinais = paraLista(conteudo?.SinaisSintomas ?? conteudo?.sinaissintomas ?? conteudo?.sinaisSintomas);
        const alertas = paraLista(conteudo?.SinaisAlerta ?? conteudo?.sinaisalerta ?? conteudo?.sinaisAlerta);
        const registrosSintoma = registrosPaciente.filter((registro) => Number(registro.sintoma_id) === Number(sintoma.id));
        const ultimo = registrosSintoma[0] || null;
        html += `
          <button type="button" class="pv-cuidador-symptom-back" data-cuid-lista>← Voltar para sintomas</button>
          <section class="pv-cuidador-symptom-detail-heading"><span class="pv-cuidador-eyebrow">SINTOMA</span><h2>${esc(nome)}</h2><p>Consulte informações educativas e o histórico informado para este paciente.</p></section>
          <div class="pv-cuidador-symptom-detail-grid">
            <article class="pv-cuidador-symptom-detail-card"><h3>Sobre este sintoma</h3>${descricao ? `<p>${esc(descricao)}</p>` : '<p>Não há definição educativa cadastrada para este sintoma no momento.</p>'}
              ${sinais.length ? `<div class="pv-cuidador-symptom-detail-section"><h4>Sinais e sintomas</h4><ul>${sinais.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div>` : ''}
              ${alertas.length ? `<div class="pv-cuidador-symptom-detail-section alert"><h4>Sinais de alerta cadastrados</h4><ul>${alertas.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div>` : ''}
            </article>
            <aside class="pv-cuidador-symptom-follow-card"><span class="pv-cuidador-card-eyebrow">ACOMPANHAMENTO</span><h3>Última intensidade informada</h3><p>${ultimo ? `${esc(ultimo.intensidade)}/10 · ${esc(formatarData(dataValor(ultimo)))}` : 'Ainda não há registro deste sintoma para o paciente selecionado.'}</p><button type="button" class="pv-cuidador-button primary" data-cuid-historico-sintoma="${Number(sintoma.id)}">Ver histórico deste sintoma</button></aside>
          </div>
          <p class="pv-cuidador-symptom-readonly-note">Este perfil pode consultar os registros autorizados. O lançamento de novas intensidades pelo cuidador não está habilitado nesta etapa.</p>`;
      }
    } else {
      const registrosFiltrados = idSintomaSolicitado
        ? registrosPaciente.filter((registro) => Number(registro.sintoma_id) === idSintomaSolicitado)
        : registrosPaciente;
      const hoje = Date.now();
      const seteDias = 7 * 24 * 60 * 60 * 1000;
      const recentes = registrosFiltrados.filter((registro) => timestamp(registro) > 0 && hoje - timestamp(registro) <= seteDias);
      const media = registrosFiltrados.length
        ? registrosFiltrados.reduce((soma, registro) => soma + (Number(registro.intensidade) || 0), 0) / registrosFiltrados.length
        : null;
      const ultimo = registrosFiltrados[0] || null;
      const nomeFiltro = idSintomaSolicitado ? (mapaSintomas.get(idSintomaSolicitado)?.nome_sintoma || 'sintoma selecionado') : '';
      html += `
        <div class="pv-cuidador-history-actions"><button type="button" class="pv-cuidador-button secondary" data-cuid-lista>← Todos os sintomas</button>${idSintomaSolicitado ? '<button type="button" class="pv-cuidador-button secondary" data-cuid-todo-historico>Ver histórico completo</button>' : ''}</div>
        <div class="pv-cuidador-history-title"><h2>${idSintomaSolicitado ? 'Histórico de ' + esc(nomeFiltro) : 'Registros recentes'}</h2><p>${esc(nomePaciente)} · dados informados no acompanhamento</p></div>
        <div class="pv-cuidador-history-stats">
          <article><span>Registros nos últimos 7 dias</span><strong>${recentes.length}</strong><small>Últimos sete dias</small></article>
          <article><span>Média informada</span><strong>${media === null ? '—' : media.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</strong><small>Escala de 0 a 10${registrosFiltrados.length ? ` · ${registrosFiltrados.length} registros` : ''}</small></article>
          <article><span>Último registro</span><strong>${ultimo ? `${esc(ultimo.intensidade)}/10` : '—'}</strong><small>${ultimo ? esc(nomeDoSintoma(ultimo)) + ' · ' + esc(formatarData(dataValor(ultimo))) : 'Sem registros disponíveis'}</small></article>
        </div>
        <section class="pv-cuidador-history-panel"><header><h3>Histórico de registros</h3><span>${registrosFiltrados.length} registro(s)</span></header>
          ${registrosFiltrados.length ? `<div class="pv-cuidador-history-list">${registrosFiltrados.map((registro) => {
            const valor = Number(registro.intensidade);
            return `<article class="pv-cuidador-history-row"><span class="pv-cuidador-history-record-icon">${iconeHomeAcompanhante('sintomas')}</span><span class="pv-cuidador-history-record-copy"><strong>${esc(nomeDoSintoma(registro))}</strong><small>${esc(formatarData(dataValor(registro)))}</small></span><span class="pv-cuidador-history-score"><small>Intensidade informada</small><strong>${Number.isFinite(valor) ? esc(valor) : '—'}<small>/10</small></strong></span></article>`;
          }).join('')}</div>` : '<div class="pv-cuidador-symptom-empty"><h2>Nenhum registro encontrado</h2><p>Não há registros para os filtros e o paciente selecionado.</p></div>'}
        </section>
        <p class="pv-cuidador-symptom-readonly-note">Este painel é de consulta. As intensidades e datas são exibidas a partir dos registros existentes, sem inferir diagnóstico ou orientação clínica.</p>`;
    }

    bodyEl.innerHTML = html;
    ligarSeletor();
    ligarBotaoVinculos();
    bodyEl.querySelectorAll('[data-cuid-sintoma]').forEach((botao) => botao.addEventListener('click', () => hashSintomas({ paciente: idPaciente, view: 'detalhe', sintoma: botao.dataset.cuidSintoma })));
    bodyEl.querySelectorAll('[data-cuid-historico]').forEach((botao) => botao.addEventListener('click', () => navegarParaHistorico()));
    bodyEl.querySelectorAll('[data-cuid-historico-sintoma]').forEach((botao) => botao.addEventListener('click', () => navegarParaHistorico(botao.dataset.cuidHistoricoSintoma)));
    bodyEl.querySelectorAll('[data-cuid-lista]').forEach((botao) => botao.addEventListener('click', () => hashSintomas({ paciente: idPaciente })));
    bodyEl.querySelectorAll('[data-cuid-todo-historico]').forEach((botao) => botao.addEventListener('click', () => navegarParaHistorico()));
    const buscaEl = bodyEl.querySelector('#pv-cuid-sintoma-busca');
    if (buscaEl) {
      buscaEl.addEventListener('input', () => {
        const termo = nomeNormalizado(buscaEl.value);
        bodyEl.querySelectorAll('[data-cuid-sintoma]').forEach((cartao) => {
          cartao.hidden = Boolean(termo && !cartao.dataset.cuidNome.includes(termo));
        });
        const visiveis = [...bodyEl.querySelectorAll('[data-cuid-sintoma]')].filter((cartao) => !cartao.hidden).length;
        const resumo = bodyEl.querySelector('.pv-cuidador-symptom-section-title span');
        if (resumo) resumo.textContent = `${visiveis} sintoma(s)`;
      });
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

    /* PaliVida: cuidador conteúdos Lovable v1 */
  function layoutBibliotecaAcompanhante(rotaAtiva, conteudoHtml) {
    const ativo = (rota) => rotaAtiva === rota ? ' active' : '';
    return `
      <div class="pv-cuidador-home-layout pv-cuidador-library-layout">
        <aside class="pv-cuidador-sidebar" aria-label="Navegação do acompanhante">
          <div class="pv-cuidador-sidebar-top">
            <div class="pv-cuidador-brand"><a href="#/home" aria-label="PaliVida — início"><img src="assets/img/logo-completo.png" alt="PaliVida"></a></div>
            <div class="pv-cuidador-nav-label">MEU CUIDADO</div>
            <nav class="pv-cuidador-nav">
              <button type="button" class="pv-cuidador-nav-item${ativo('home')}" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
              <button type="button" class="pv-cuidador-nav-item${ativo('vinculos')}" data-cuidador-rota="/vinculos">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
              <button type="button" class="pv-cuidador-nav-item${ativo('sintomas')}" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
              <button type="button" class="pv-cuidador-nav-item${ativo('conteudos')}" data-cuidador-rota="/busca" aria-current="${rotaAtiva === 'conteudos' ? 'page' : 'false'}">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
              <button type="button" class="pv-cuidador-nav-item${ativo('perfil')}" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
            </nav>
          </div>
          <div class="pv-cuidador-sidebar-footer">
            <div class="pv-cuidador-sidebar-profile"><span class="pv-cuidador-avatar" id="pv-cuidador-library-avatar" aria-hidden="true">A</span><span class="pv-cuidador-profile-text"><strong id="pv-cuidador-library-name">Acompanhante</strong><small>Acompanhante</small></span></div>
            <button type="button" class="pv-cuidador-logout" data-sair>${iconeHomeAcompanhante('sair')}<span>Sair</span></button>
          </div>
        </aside>
        <section class="pv-cuidador-workspace">
          <header class="pv-cuidador-topbar"><strong>Meu cuidado</strong><div class="pv-cuidador-topbar-actions"><span>Protótipo demonstrativo</span><button type="button" class="pv-cuidador-topbar-icon" data-cuidador-rota="/busca" aria-label="Abrir biblioteca de conteúdos">${iconeHomeAcompanhante('busca')}</button></div></header>
          <main class="pv-cuidador-content pv-cuidador-library-content">${conteudoHtml}</main>
        </section>
        <nav class="pv-cuidador-mobile-nav" aria-label="Navegação principal">
          <button type="button" class="${ativo('home').trim()}" data-cuidador-rota="/home">${iconeHomeAcompanhante('inicio')}<span>Início</span></button>
          <button type="button" class="${ativo('vinculos').trim()}" data-cuidador-rota="/vinculos">${iconeHomeAcompanhante('vinculos')}<span>Vínculos</span></button>
          <button type="button" class="${ativo('sintomas').trim()}" data-cuidador-rota="/sintomas">${iconeHomeAcompanhante('sintomas')}<span>Sintomas</span></button>
          <button type="button" class="${ativo('conteudos').trim()}" data-cuidador-rota="/busca">${iconeHomeAcompanhante('conteudos')}<span>Conteúdos</span></button>
          <button type="button" class="${ativo('perfil').trim()}" data-cuidador-rota="/perfil">${iconeHomeAcompanhante('perfil')}<span>Perfil</span></button>
        </nav>
      </div>`;
  }

  function prepararBibliotecaAcompanhante(main) {
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    if (header) { header.hidden = true; header.innerHTML = ''; }
    if (footer) { footer.hidden = true; footer.innerHTML = ''; }
    main.classList.remove('pv-sem-scroll', 'pv-cuidador-vinculos-main', 'pv-cuidador-sintomas-main', 'pv-conteudo-detalhe-main', 'pv-cuidador-conteudos-main');
    main.classList.add('pv-cuidador-conteudos-main');
  }

  function ligarBibliotecaAcompanhante(main, ctx) {
    main.querySelectorAll('[data-cuidador-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.cuidadorRota));
    });
    PV.ui.ligarLogout(main);
    const nomeEl = main.querySelector('#pv-cuidador-library-name');
    const avatarEl = main.querySelector('#pv-cuidador-library-avatar');
    PV.db.acompanhantes.buscar(ctx.usuario.id).then((perfil) => {
      if (!main.isConnected) return;
      const nome = perfil?.nome_social || perfil?.nome_completo || 'Acompanhante';
      if (nomeEl) nomeEl.textContent = nome;
      if (avatarEl) {
        const partes = String(nome).trim().split(/\s+/).filter(Boolean);
        avatarEl.textContent = (partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : String(nome).slice(0, 2)).toLocaleUpperCase('pt-BR');
      }
    }).catch(() => {
      if (ctx.usuario.email && nomeEl && main.isConnected) nomeEl.textContent = ctx.usuario.email.split('@')[0];
    });
  }

  function categoriaBibliotecaAcompanhante(conteudo) {
    const declarada = conteudo.categoria || conteudo.tema || conteudo.sintoma || conteudo.assunto;
    if (declarada) return String(declarada);
    const titulo = String(conteudo.titulo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const regras = [
      [/bem.?estar|qualidade de vida/, 'Bem-estar'],
      [/dor/, 'Dor'],
      [/fadiga|cansaco/, 'Fadiga'],
      [/ansiedade|preocupacao/, 'Ansiedade'],
      [/sono|insonia|sonolencia/, 'Sono'],
      [/alimentacao|apetite|anorexia|nutricao/, 'Alimentação'],
      [/nausea|vomit/, 'Náuseas'],
      [/respiracao|dispneia|falta de ar/, 'Respiração'],
    ];
    const regra = regras.find(([expressao]) => expressao.test(titulo));
    return regra ? regra[1] : 'Cuidado';
  }

  function tempoLeituraBibliotecaAcompanhante(conteudo) {
    const corpo = String(conteudo.texto || conteudo.descricao || '').trim();
    const palavras = corpo ? corpo.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(palavras / 180));
  }

  async function buscaAcompanhanteLovable(main, ctx) {
    prepararBibliotecaAcompanhante(main);
    const esc = (valor) => PV.ui.escaparHtml(String(valor ?? ''));
    main.innerHTML = layoutBibliotecaAcompanhante('conteudos', `
      <section class="pv-cuidador-heading pv-cuidador-library-heading">
        <span class="pv-cuidador-eyebrow">BIBLIOTECA</span>
        <h1>Conteúdos para o cuidado</h1>
        <p>Informações organizadas para uma leitura simples e confortável.</p>
      </section>
      <div class="pv-cuidador-library-toolbar">
        <span id="pv-cuidador-library-count">Carregando conteúdos...</span>
        <button type="button" class="pv-cuidador-button secondary" id="pv-cuidador-library-search-toggle">${iconeHomeAcompanhante('busca')}<span>Buscar</span></button>
      </div>
      <div class="pv-cuidador-library-search" id="pv-cuidador-library-search" hidden><label for="pv-cuidador-library-search-input">Buscar por tema ou título</label><input id="pv-cuidador-library-search-input" type="search" placeholder="Digite o tema ou título do conteúdo..."></div>
      <div class="pv-cuidador-library-notice" id="pv-cuidador-library-notice" hidden></div>
      <section class="pv-cuidador-library-grid" id="pv-cuidador-library-grid"><div class="pv-cuidador-library-loading"><span class="pv-cuidador-symptom-spinner" aria-hidden="true"></span>Carregando conteúdos...</div></section>
    `);
    ligarBibliotecaAcompanhante(main, ctx);
    const countEl = main.querySelector('#pv-cuidador-library-count');
    const gridEl = main.querySelector('#pv-cuidador-library-grid');
    const noticeEl = main.querySelector('#pv-cuidador-library-notice');
    const searchToggle = main.querySelector('#pv-cuidador-library-search-toggle');
    const searchPanel = main.querySelector('#pv-cuidador-library-search');
    const searchInput = main.querySelector('#pv-cuidador-library-search-input');
    let lista = [];

    searchToggle.addEventListener('click', () => {
      searchPanel.hidden = !searchPanel.hidden;
      if (!searchPanel.hidden) searchInput.focus();
    });

    function renderizarLista() {
      const termo = String(searchInput.value || '').trim().toLocaleLowerCase('pt-BR');
      const filtrados = lista.filter((item) => [item.titulo, item.descricao, item.texto, categoriaBibliotecaAcompanhante(item)].join(' ').toLocaleLowerCase('pt-BR').includes(termo));
      countEl.textContent = termo ? `${filtrados.length} resultado(s)` : `${lista.length} conteúdo(s)`;
      if (!filtrados.length) {
        gridEl.innerHTML = `<div class="pv-cuidador-library-empty"><span>${iconeHomeAcompanhante('conteudos')}</span><strong>${lista.length ? 'Nenhum conteúdo encontrado' : 'Nenhum conteúdo disponível'}</strong><p>${lista.length ? 'Experimente pesquisar por outro termo.' : 'Não há materiais educativos disponíveis neste momento.'}</p>${termo ? '<button type="button" class="pv-cuidador-button secondary" id="pv-cuidador-library-clear">Limpar busca</button>' : ''}</div>`;
        main.querySelector('#pv-cuidador-library-clear')?.addEventListener('click', () => { searchInput.value = ''; renderizarLista(); });
        return;
      }
      gridEl.innerHTML = filtrados.map((item) => {
        const categoria = categoriaBibliotecaAcompanhante(item);
        const descricao = String(item.descricao || '').trim();
        const leitura = tempoLeituraBibliotecaAcompanhante(item);
        return `<button type="button" class="pv-cuidador-library-card" data-abrir-conteudo="${esc(item.id)}"><span class="pv-cuidador-library-card-top"><span class="pv-cuidador-library-tag">${esc(categoria)}</span><span class="pv-cuidador-library-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span><strong>${esc(item.titulo || 'Conteúdo educativo')}</strong>${descricao ? `<p>${esc(descricao)}</p>` : ''}<small>${leitura} min de leitura</small></button>`;
      }).join('');
      gridEl.querySelectorAll('[data-abrir-conteudo]').forEach((botao) => {
        botao.addEventListener('click', () => PV.router.navegar('/conteudo/' + encodeURIComponent(botao.dataset.abrirConteudo)));
      });
    }
    searchInput.addEventListener('input', renderizarLista);

    try {
      lista = await PV.db.conteudos.listar({ timeoutMs: 8000 });
      if (!main.isConnected) return;
      renderizarLista();
    } catch (erro) {
      if (!main.isConnected) return;
      countEl.textContent = 'Biblioteca';
      noticeEl.hidden = false;
      noticeEl.textContent = erro.message || 'Não foi possível carregar os conteúdos. Tente novamente.';
      gridEl.innerHTML = `<div class="pv-cuidador-library-empty"><strong>Não foi possível carregar os conteúdos</strong><p>Verifique sua conexão e atualize a tela para tentar novamente.</p><button type="button" class="pv-cuidador-button secondary" id="pv-cuidador-library-retry">Tentar novamente</button></div>`;
      main.querySelector('#pv-cuidador-library-retry')?.addEventListener('click', () => PV.router.renderizar());
    }
  }

  async function conteudoDetalheAcompanhante(main, ctx) {
    prepararBibliotecaAcompanhante(main);
    const esc = (valor) => PV.ui.escaparHtml(String(valor ?? ''));
    main.innerHTML = layoutBibliotecaAcompanhante('conteudos', `
      <button type="button" class="pv-cuidador-library-back" data-cuidador-rota="/busca">← Voltar aos conteúdos</button>
      <section class="pv-cuidador-heading pv-cuidador-library-heading"><span class="pv-cuidador-eyebrow">BIBLIOTECA</span><h1>Carregando conteúdo...</h1><p>Materiais educativos para apoiar a rotina de cuidado.</p></section>
      <div class="pv-cuidador-library-loading"><span class="pv-cuidador-symptom-spinner" aria-hidden="true"></span>Carregando leitura...</div>
    `);
    ligarBibliotecaAcompanhante(main, ctx);
    let conteudo;
    try {
      conteudo = await PV.db.conteudos.buscar(ctx.sub);
    } catch (erro) {
      if (!main.isConnected) return;
      main.querySelector('.pv-cuidador-library-heading h1').textContent = 'Conteúdo indisponível';
      main.querySelector('.pv-cuidador-library-heading p').textContent = erro.message || 'Não foi possível carregar este conteúdo.';
      main.querySelector('.pv-cuidador-library-loading').textContent = 'Volte à biblioteca e tente novamente.';
      return;
    }
    if (!main.isConnected) return;
    const titulo = conteudo?.titulo || 'Conteúdo educativo';
    const descricao = String(conteudo?.descricao || '').trim();
    const texto = String(conteudo?.texto || '').trim();
    const corpo = texto && texto !== descricao ? texto : (texto || descricao);
    const paragrafos = corpo.split(/\r?\n+/).map((p) => p.trim()).filter(Boolean);
    const sinais = Array.isArray(conteudo?.SinaisSintomas) ? conteudo.SinaisSintomas : String(conteudo?.SinaisSintomas || conteudo?.sinaissintomas || '').split(/[;\n]+/).map((x) => x.trim()).filter(Boolean);
    const alertas = Array.isArray(conteudo?.SinaisAlerta) ? conteudo.SinaisAlerta : String(conteudo?.SinaisAlerta || conteudo?.sinaisalerta || '').split(/[;\n]+/).map((x) => x.trim()).filter(Boolean);
    const referencias = Array.isArray(conteudo?.Referencias) ? conteudo.Referencias : String(conteudo?.Referencias || conteudo?.referencias || '').split(/[;\n]+/).map((x) => x.trim()).filter(Boolean);
    const heading = main.querySelector('.pv-cuidador-library-heading');
    heading.innerHTML = `<span class="pv-cuidador-eyebrow">BIBLIOTECA</span><h1>${esc(titulo)}</h1><p>${esc(descricao || 'Informações educativas para apoiar a rotina de cuidado.')}</p>`;
    const loading = main.querySelector('.pv-cuidador-library-loading');
    loading.className = 'pv-cuidador-library-detail';
    loading.innerHTML = `
      <article class="pv-cuidador-library-article"><span class="pv-cuidador-library-tag">${esc(categoriaBibliotecaAcompanhante(conteudo))}</span>${paragrafos.length ? paragrafos.map((p) => `<p>${esc(p)}</p>`).join('') : '<p>Não há texto complementar cadastrado para este conteúdo.</p>'}</article>
      ${sinais.length || alertas.length ? `<aside class="pv-cuidador-library-article-side">${sinais.length ? `<section><h2>Sinais e sintomas relacionados</h2><ul>${sinais.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></section>` : ''}${alertas.length ? `<section class="alert"><h2>Sinais de alerta</h2><ul>${alertas.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></section>` : ''}</aside>` : ''}
      ${referencias.length ? `<section class="pv-cuidador-library-references"><h2>Referências</h2><ul>${referencias.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></section>` : ''}
      <p class="pv-cuidador-library-disclaimer">Conteúdo educativo. Em caso de dúvida, converse com a equipe de saúde responsável pelo cuidado.</p>`;
  }

async function busca(main, ctx) {
    if (ctx.usuario.tipo === 'acompanhante') {
      await buscaAcompanhanteLovable(main, ctx);
      return;
    }

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

    const destino = ehAdmin && ctx.adminStandalone && PV.ui.montarLayoutAdmin
      ? PV.ui.montarLayoutAdmin(main, 'contents', ctx)
      : main;

    destino.innerHTML = `
      <div class="${ehAdmin && ctx.adminStandalone ? 'pv-admin-content-page' : 'tela-busca'}">
        ${ehAdmin && ctx.adminStandalone ? `<div class="pv-admin-page-heading"><div><span class="pv-admin-eyebrow">ADMINISTRAÇÃO</span><h1>Gestão de conteúdos</h1><p>Gerencie os materiais educativos disponíveis no PaliVida.</p></div><button type="button" class="pv-admin-primary-button" id="btn-novo-conteudo"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span>Adicionar</span></button></div>` : ''}

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
          ehAdmin && !ctx.adminStandalone
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
      } else if (ehAdmin && ctx.adminStandalone) {
        listaEl.innerHTML = `
          <div class="pv-admin-table-wrap"><table class="pv-admin-table">
            <thead><tr><th>NOME</th><th>INFORMAÇÃO</th><th>STATUS</th><th>ATUALIZAÇÃO</th><th></th></tr></thead>
            <tbody>${filtrados.map((c) => `<tr>
              <td><strong>${escaparHtml(c.titulo || 'Conteúdo sem título')}</strong></td>
              <td>${escaparHtml(String(c.descricao || c.texto || '').slice(0, 100) || 'Sem descrição')}</td>
              <td><span class="pv-admin-status is-good">Cadastrado</span></td>
              <td>${escaparHtml(formatarDataConteudo(c.data_post) || '—')}</td>
              <td><div class="pv-admin-row-actions"><button type="button" class="pv-admin-row-action" data-editar="${escaparHtml(c.id)}" aria-label="Editar conteúdo" title="Editar conteúdo"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button><button type="button" class="pv-admin-row-action" data-excluir="${escaparHtml(c.id)}" aria-label="Excluir conteúdo" title="Excluir conteúdo"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/></svg></button></div></td>
            </tr>`).join('')}</tbody>
          </table></div>`;
      } else {
        listaEl.innerHTML = filtrados.map((c) => cardConteudoHtml(c, ehAdmin)).join('');
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

  async function dashboardAdmin(main, ctx) {
    const slot = PV.ui.montarLayoutAdmin(main, 'home', ctx);
    slot.innerHTML = '<div class="pv-admin-state">Carregando indicadores...</div>';

    let registros = [], sintomas = [], conteudos = [], pacientes = [];
    const erros = [];
    const results = await Promise.allSettled([
      PV.db.registros.listar(), PV.db.sintomas.listar(),
      PV.db.conteudos.listar({ timeoutMs: 20000 }), PV.db.pacientes.listar(),
    ]);
    if (results[0].status === 'fulfilled') registros = results[0].value || []; else erros.push(results[0].reason?.message || 'Falha ao carregar registros.');
    if (results[1].status === 'fulfilled') sintomas = results[1].value || []; else erros.push(results[1].reason?.message || 'Falha ao carregar sintomas.');
    if (results[2].status === 'fulfilled') conteudos = results[2].value || []; else erros.push(results[2].reason?.message || 'Falha ao carregar conteúdos.');
    if (results[3].status === 'fulfilled') pacientes = results[3].value || []; else erros.push(results[3].reason?.message || 'Falha ao carregar pacientes.');
    if (!main.isConnected || !slot.isConnected) return;

    const nomesSintomas = new Map(sintomas.map((s) => [Number(s.id), s.nome_sintoma || `Sintoma #${s.id}`]));
    const nomesPacientes = new Map(pacientes.map((p) => [Number(p.id), p.nome_social || p.nome || `Paciente #${p.id}`]));
    const intensidades = registros.map((r) => Number(r.intensidade)).filter((v) => Number.isFinite(v) && v >= 0 && v <= 10);
    const media = intensidades.length ? intensidades.reduce((sum, v) => sum + v, 0) / intensidades.length : null;
    const sorted = [...intensidades].sort((a, b) => a - b);
    const mediana = sorted.length ? (sorted.length % 2 ? sorted[Math.floor(sorted.length / 2)] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : null;
    const variancia = intensidades.length && media !== null ? intensidades.reduce((sum, v) => sum + (v - media) ** 2, 0) / intensidades.length : null;
    const desvio = variancia === null ? null : Math.sqrt(variancia);
    const number = (v) => v === null || !Number.isFinite(v) ? '—' : Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    const keyDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const today = new Date();
    const dias = [];
    for (let offset = 6; offset >= 0; offset--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      dias.push({ key: keyDate(d), label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3), date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), total: 0 });
    }
    const byDay = new Map(dias.map((d) => [d.key, d]));
    registros.forEach((r) => { const d = new Date(r.data_registro); if (!Number.isNaN(d.getTime())) { const item = byDay.get(keyDate(d)); if (item) item.total++; } });
    const highest = Math.max(1, ...dias.map((d) => d.total));
    const recent = [...registros].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro)).slice(0, 6);
    const recentHtml = recent.map((r) => `<div class="pv-admin-recent-row"><div class="pv-admin-recent-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>'}</div><div class="pv-admin-recent-copy"><strong>${escaparHtml(nomesSintomas.get(Number(r.sintoma_id)) || `Sintoma #${r.sintoma_id}`)}</strong><small>${escaparHtml(nomesPacientes.get(Number(r.paciente_id)) || `Paciente #${r.paciente_id}`)} · ${escaparHtml(r.data_registro ? new Date(r.data_registro).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Data não informada')}</small></div><span class="pv-admin-level">Nível ${escaparHtml(r.intensidade ?? '—')}</span></div>`).join('');

    slot.innerHTML = `
      <div class="pv-admin-overview-page">
        <div class="pv-admin-page-heading"><div><span class="pv-admin-eyebrow">ADMINISTRAÇÃO</span><h1>Visão geral</h1><p>Acompanhe os principais indicadores do PaliVida.</p></div></div>
        ${erros.length ? `<div class="pv-admin-alert" role="status">${escaparHtml([...new Set(erros)].join(' '))}</div>` : ''}
        <section class="pv-admin-stats" aria-label="Indicadores principais">
          <article class="pv-admin-stat-card"><span>Pacientes cadastrados</span><strong>${results[3].status === 'fulfilled' ? pacientes.length.toLocaleString('pt-BR') : '—'}</strong><small>Cadastros no sistema</small></article>
          <article class="pv-admin-stat-card"><span>Registros</span><strong>${results[0].status === 'fulfilled' ? registros.length.toLocaleString('pt-BR') : '—'}</strong><small>Histórico de intensidade</small></article>
          <article class="pv-admin-stat-card"><span>Média de intensidade</span><strong>${number(media)}</strong><small>Escala de 0 a 10</small></article>
          <article class="pv-admin-stat-card"><span>Conteúdos cadastrados</span><strong>${results[2].status === 'fulfilled' ? conteudos.length.toLocaleString('pt-BR') : '—'}</strong><small>Materiais educativos</small></article>
        </section>
        <section class="pv-admin-overview-grid">
          <article class="pv-admin-panel pv-admin-chart-panel"><div class="pv-admin-panel-heading"><div><h2>Registros por período</h2><p>Quantidade de registros nos últimos 7 dias</p></div><span class="pv-admin-panel-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'}</span></div><div class="pv-admin-chart" role="img" aria-label="Registros por dia nos últimos sete dias">${dias.map((d) => `<div class="pv-admin-chart-column"><span class="pv-admin-chart-number">${d.total}</span><div class="pv-admin-chart-track"><span style="height:${d.total ? Math.max(5, d.total / highest * 100) : 0}%"></span></div><small>${escaparHtml(d.label)}</small><em>${escaparHtml(d.date)}</em></div>`).join('')}</div></article>
          <article class="pv-admin-panel pv-admin-indicators"><div class="pv-admin-panel-heading"><div><h2>Indicadores estatísticos</h2><p>Resumo das intensidades registradas</p></div></div><div class="pv-admin-indicator-row"><span>Mediana</span><strong>${number(mediana)}</strong></div><div class="pv-admin-indicator-row"><span>Variância</span><strong>${number(variancia === null ? null : Number(variancia.toFixed(2)))}</strong></div><div class="pv-admin-indicator-row"><span>Desvio padrão</span><strong>${number(desvio === null ? null : Number(desvio.toFixed(2)))}</strong></div><div class="pv-admin-indicator-row"><span>Média diária (7 dias)</span><strong>${number(dias.reduce((sum, d) => sum + d.total, 0) / 7)}</strong></div></article>
        </section>
        <section class="pv-admin-panel pv-admin-section-panel"><div class="pv-admin-panel-heading"><div><h2>Registros recentes</h2><p>Últimos registros recebidos pelo PaliVida</p></div><button type="button" class="pv-admin-text-link" data-rota="/admin-registros">Ver todos <span aria-hidden="true">›</span></button></div><div class="pv-admin-recent-list">${recentHtml || '<p class="pv-admin-empty">Ainda não há registros de sintomas.</p>'}</div></section>
      </div>`;
    slot.querySelectorAll('[data-rota]').forEach((button) => button.addEventListener('click', () => PV.router.navegar(button.dataset.rota)));
  }

  PV.screens.vinculosAcompanhante = telaVinculosAcompanhante;
  PV.screens.sintomasAcompanhante = telaSintomasAcompanhante;
  PV.screens.conteudoDetalheAcompanhante = conteudoDetalheAcompanhante;
  PV.screens.home = home;
  PV.screens.contato = contato;
  PV.screens.busca = busca;
  PV.screens.dashboardAdmin =
    dashboardAdmin;
})();
