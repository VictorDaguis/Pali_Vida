/**
 * Fluxo de sintomas — porta de screens/MenuSintomasScreen.tsx,
 * components/ListaSintomas.tsx, components/ModalIntensidade.tsx,
 * screens/ConteudoDetalheScreen.tsx, screens/DefinicaoSintomasScreen.tsx
 * e screens/sinais.tsx + screens/TelaSinal.tsx.
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};

(function () {
  const { escaparHtml, aviso, carregando, spinner, ligarNavegacaoInferior, svgRelatorio } = PV.ui;

  /* ===================================================== ListaSintomas === */
  function gradeVaziaHtml(msg) {
    return `<p class="lista-vazia" style="text-align:center;color:var(--marrom);margin-top:20px">${escaparHtml(msg)}</p>`;
  }

  async function montarListaSintomas(container, onSelecionar) {

    container.innerHTML = carregando();
  
    let sintomas = [];
    let registros = [];
    let erro = null;
  
    try {
  
      [sintomas, registros] = await Promise.all([
        PV.db.sintomas.listar(),
        PV.db.registros.listar()
      ]);
  
    } catch (e) {
  
      erro =
        e.message ||
        'Erro ao carregar sintomas.';
  
    }
  
  
    /*
     * Último registro de cada sintoma para o paciente atual.
     *
     * Não criamos nenhuma regra nova.
     * Apenas usamos os registros que já existem.
     */
  
    const ultimoRegistroPorSintoma = new Map();
  
    if (!erro) {
  
      registros
        .filter(
          (registro) =>
            Number(registro.paciente_id) ===
            Number(
              PV.session?.obterUsuario?.()?.id ||
              PV.session?.usuarioAtual?.()?.id ||
              0
            )
        )
        .forEach((registro) => {
  
          const sintomaId =
            Number(registro.sintoma_id);
  
          const anterior =
            ultimoRegistroPorSintoma.get(sintomaId);
  
          if (
            !anterior ||
            new Date(registro.data_registro) >
              new Date(anterior.data_registro)
          ) {
  
            ultimoRegistroPorSintoma.set(
              sintomaId,
              registro
            );
  
          }
  
        });
  
    }
  
  
    function obterIniciais(nome) {
  
      const palavras =
        String(nome || '')
          .replace(/[()]/g, ' ')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .filter(
            (palavra) =>
              ![
                'e',
                'da',
                'de',
                'do',
                'das',
                'dos'
              ].includes(
                palavra.toLowerCase()
              )
          );
  
      if (!palavras.length) {
        return 'SY';
      }
  
      if (palavras.length === 1) {
        return palavras[0]
          .slice(0, 2)
          .toUpperCase();
      }
  
      return (
        palavras[0].charAt(0) +
        palavras[1].charAt(0)
      ).toUpperCase();
  
    }
  
  
    function renderizar(textoBusca = '') {
  
      if (erro) {
  
        container.innerHTML = `
          <div class="pv-sintomas-estado-vazio">
            ${escaparHtml(erro)}
          </div>
        `;
  
        return;
      }
  
  
      const termo =
        String(textoBusca || '')
          .trim()
          .toLowerCase();
  
  
      const filtrados =
        sintomas.filter((sintoma) =>
          String(
            sintoma.nome_sintoma || ''
          )
            .toLowerCase()
            .includes(termo)
        );
  
  
      if (!filtrados.length) {
  
        container.innerHTML = `
          <div class="pv-sintomas-estado-vazio">
            Nenhum sintoma encontrado.
          </div>
        `;
  
        return;
      }
  
  
      container.innerHTML = `
  
        <div class="pv-sintomas-grid">
  
          ${filtrados
            .map((sintoma) => {
  
              const ultimo =
                ultimoRegistroPorSintoma.get(
                  Number(sintoma.id)
                );
  
              return `
  
                <button
                  type="button"
                  class="pv-sintoma-item"
                  data-sintoma="${escaparHtml(sintoma.id)}"
                >
  
                  <span
                    class="pv-sintoma-iniciais"
                    aria-hidden="true"
                  >
                    ${escaparHtml(
                      obterIniciais(
                        sintoma.nome_sintoma
                      )
                    )}
                  </span>
  
                  <span class="pv-sintoma-info">
  
                    <strong>
                      ${escaparHtml(
                        sintoma.nome_sintoma
                      )}
                    </strong>
  
                    <small>
                      Informações e acompanhamento
                    </small>
  
                    ${
                      ultimo
                        ? `
                          <em>
                            Último registro:
                            ${escaparHtml(
                              ultimo.intensidade
                            )}/10
                          </em>
                        `
                        : ''
                    }
  
                  </span>
  
                  <span
                    class="pv-sintoma-seta"
                    aria-hidden="true"
                  >
                    ›
  
                  </span>
  
                </button>
  
              `;
  
            })
            .join('')}
  
        </div>
  
  
        <button
          type="button"
          class="pv-sintomas-sem-registro"
          id="btn-sem-sintoma"
        >
          <span aria-hidden="true">♡</span>
  
          Não tive nenhum desses sintomas hoje
        </button>
      `;
  
  
      container
        .querySelectorAll('[data-sintoma]')
        .forEach((btn) => {
  
          btn.addEventListener(
            'click',
            () => {
  
              const sintoma =
                sintomas.find(
                  (item) =>
                    String(item.id) ===
                    btn.dataset.sintoma
                );
  
              if (sintoma) {
                onSelecionar(sintoma);
              }
  
            }
          );
  
        });
  
  
      container
        .querySelector('#btn-sem-sintoma')
        .addEventListener(
          'click',
          () => PV.router.navegar('/sinal/verde')
        );
  
    }
  
  
    /*
     * Primeira renderização.
     */
  
    renderizar();
  
  
    /*
     * Busca da tela.
     */
  
    const campoBusca =
      container
        .closest('.pv-menu-sintomas-modern')
        ?.querySelector('#pv-busca-sintoma');
  
  
    if (campoBusca) {
  
      campoBusca.addEventListener(
        'input',
        () => {
          renderizar(campoBusca.value);
        }
      );
  
    }
  
  }

  /* =================================================== ModalIntensidade ===
     A escala de 11 botões numerados foi substituída por uma barra em
     gradiente (verde -> vermelho) que o usuário arrasta lateralmente com o
     dedo/mouse para escolher a intensidade de 0 a 10 — sem precisar acertar
     um alvo pequeno nem rolar a tela.

     `aoRegistrar` é chamado após um registro ser salvo com sucesso, para que
     quem montou o modal (menuSintomas) possa, por exemplo, atualizar o
     painel de "sintomas de hoje" — o próprio modal não navega mais para
     outra tela: fechar aqui só esconde o modal e devolve o foco para a
     grade de sintomas, permitindo registrar vários sintomas em sequência
     sem sair da tela. */
  function montarModalIntensidade(root, ctx, aoRegistrar) {
    const overlay = document.createElement('div');
    overlay.className = 'pv-modal-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="pv-modal-intensidade">
        <div class="titulo">Qual é a intensidade do sintoma?</div>
        <div class="sintoma" id="mi-sintoma"></div>
        <div id="mi-aviso"></div>
        <div class="pv-slider-intensidade" id="mi-slider">
          <div class="pv-slider-valor" id="mi-slider-valor">–</div>
          <div class="pv-slider-track" id="mi-slider-track">
            <div class="pv-slider-thumb" id="mi-slider-thumb"></div>
          </div>
          <div class="pv-slider-marcadores"><span>0</span><span>5</span><span>10</span></div>
        </div>
        <div class="acoes">
          <button type="button" class="botao cancelar" id="mi-cancelar">Cancelar</button>
          <button type="button" class="botao confirmar" id="mi-confirmar">Confirmar</button>
        </div>
      </div>`;
    root.appendChild(overlay);

    let sintomaAtual = null;
    let intensidade = null;

    const track = overlay.querySelector('#mi-slider-track');
    const thumb = overlay.querySelector('#mi-slider-thumb');
    const valorEl = overlay.querySelector('#mi-slider-valor');

    function aplicarValor(v) {
      intensidade = Math.max(0, Math.min(10, Math.round(v)));
      thumb.style.left = (intensidade / 10) * 100 + '%';
      valorEl.textContent = String(intensidade);
    }

    function valorApartirDoPonto(clientX) {
      const rect = track.getBoundingClientRect();
      const fracao = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
      return fracao * 10;
    }

    let arrastando = false;
    function iniciarArraste(clientX) {
      arrastando = true;
      aplicarValor(valorApartirDoPonto(clientX));
    }
    function moverArraste(clientX) {
      if (!arrastando) return;
      aplicarValor(valorApartirDoPonto(clientX));
    }
    function pararArraste() {
      arrastando = false;
    }

    track.addEventListener('pointerdown', (e) => {
      track.setPointerCapture(e.pointerId);
      iniciarArraste(e.clientX);
    });
    track.addEventListener('pointermove', (e) => moverArraste(e.clientX));
    track.addEventListener('pointerup', pararArraste);
    track.addEventListener('pointercancel', pararArraste);

    // Suporte a teclado (acessibilidade): setas esquerda/direita ajustam o valor.
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'slider');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '10');
    track.addEventListener('keydown', (e) => {
      const atual = intensidade === null ? 0 : intensidade;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { aplicarValor(atual + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { aplicarValor(atual - 1); e.preventDefault(); }
    });

    function fechar() {
      overlay.hidden = true;
      intensidade = null;
      overlay.querySelector('#mi-aviso').innerHTML = '';
      thumb.style.left = '0%';
      valorEl.textContent = '?';
      // Reabilita e restaura o botão de confirmar, que pode ter ficado
      // desabilitado com o spinner do registro anterior — sem isso, ao
      // registrar um segundo sintoma em seguida, o botão "Confirmar"
      // continuaria travado.
      const botaoConfirmar = overlay.querySelector('#mi-confirmar');
      botaoConfirmar.disabled = false;
      botaoConfirmar.textContent = 'Confirmar';
    }

    overlay.querySelector('#mi-cancelar').addEventListener('click', fechar);
    overlay.querySelector('#mi-confirmar').addEventListener('click', async () => {
      const avisoEl = overlay.querySelector('#mi-aviso');
      if (intensidade === null) {
        avisoEl.innerHTML = aviso({ tipo: 'erro', texto: 'Arraste a barra para indicar a intensidade antes de confirmar.' });
        return;
      }
      const botao = overlay.querySelector('#mi-confirmar');
      botao.disabled = true;
      botao.innerHTML = spinner(true);
      try {
        await PV.db.registros.criar({ paciente_id: ctx.usuario.id, sintoma_id: sintomaAtual.id, intensidade });
        PV.session.marcarSintomaRegistradoHoje();
        fechar();
        // Continua na tela de sintomas (sem voltar para a Home) — quem
        // precisar ver o que já foi registrado hoje usa o ícone de
        // relatório no canto da tela, que este callback mantém atualizado.
        if (typeof aoRegistrar === 'function') aoRegistrar();
      } catch (e) {
        avisoEl.innerHTML = aviso({ tipo: 'erro', texto: e.message || 'Não foi possível registrar o sintoma.' });
        botao.disabled = false;
        botao.textContent = 'Confirmar';
      }
    });

    return {
      abrir(sintoma) {
        sintomaAtual = sintoma;
        overlay.querySelector('#mi-sintoma').textContent = sintoma ? sintoma.nome_sintoma : '';
        overlay.hidden = false;
        // Começa sem valor definido — o usuário precisa arrastar a barra ao
        // menos uma vez para escolher a intensidade, evitando registrar um
        // 0 "por acidente" ao só confirmar sem interagir.
        intensidade = null;
        thumb.style.left = '0%';
        valorEl.textContent = '?';
      },
    };
  }

  /* ============================================================ PainelHoje ===
     Painel deslizante (drawer), aberto por um ícone discreto no canto da
     tela de Menu de Sintomas, mostrando os sintomas já registrados hoje
     (nome + intensidade) sem precisar sair da tela nem voltar para a Home.
     Substitui o antigo painel de teste solto (js/relatorio-teste.js, agora
     removido) por algo integrado à mesma linguagem visual do restante do
     app (mesmo overlay escuro, mesmos tons de azul/creme, mesma tipografia). */
  function corPorIntensidade(v) {
    if (v <= 3) return '#9BC45A';   // verde — leve
    if (v <= 6) return '#F1D359';   // amarelo — moderado
    return '#D63031';               // vermelho — intenso
  }

  function montarPainelHoje(root, ctx) {
    const overlay = document.createElement('div');
    overlay.className = 'pv-painel-hoje-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="pv-painel-hoje" role="dialog" aria-label="Sintomas registrados hoje">
        <div class="pv-painel-hoje-cabecalho">
          <span>Sintomas de hoje</span>
          <button type="button" id="ph-fechar" aria-label="Fechar">&times;</button>
        </div>
        <div id="ph-lista" class="pv-painel-hoje-lista"></div>
      </div>`;
    root.appendChild(overlay);

    const listaEl = overlay.querySelector('#ph-lista');

    function fechar() { overlay.hidden = true; }
    function abrir() {
      overlay.hidden = false;
      atualizar();
    }
    // Se o painel já estiver aberto no momento em que um novo sintoma é
    // registrado, atualiza a lista na hora; se estiver fechado, não faz
    // nada agora — os dados serão buscados de novo na próxima vez que o
    // usuário abrir o painel (abrir() sempre chama atualizar()).
    function atualizarSeAberto() {
      if (!overlay.hidden) atualizar();
    }
    // Clicar no fundo escurecido (fora do cartão) também fecha, como os
    // demais modais do app.
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
    overlay.querySelector('#ph-fechar').addEventListener('click', fechar);

    async function atualizar() {
      listaEl.innerHTML = carregando();
      let registros, sintomas;
      try {
        [registros, sintomas] = await Promise.all([PV.db.registros.listar(), PV.db.sintomas.listar()]);
      } catch (e) {
        listaEl.innerHTML = aviso({ tipo: 'erro', texto: e.message || 'Não foi possível carregar os sintomas de hoje.' });
        return;
      }
      const nomesPorId = new Map(sintomas.map((s) => [Number(s.id), s.nome_sintoma]));
      const hojeChave = new Date().toDateString();
      const deHoje = registros
        .filter((r) => Number(r.paciente_id) === Number(ctx.usuario.id) && new Date(r.data_registro).toDateString() === hojeChave)
        .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro));

      if (!deHoje.length) {
        listaEl.innerHTML = `<p class="pv-painel-hoje-vazio">Nenhum sintoma registrado ainda hoje.</p>`;
        return;
      }

      listaEl.innerHTML = deHoje.map((r) => {
        const hora = new Date(r.data_registro).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const nome = nomesPorId.get(Number(r.sintoma_id)) || 'Sintoma';
        return `
          <div class="pv-painel-hoje-item">
            <div class="pv-painel-hoje-linha1">
              <span class="pv-painel-hoje-nome">${escaparHtml(nome)}</span>
              <span class="pv-painel-hoje-nota" style="background:${corPorIntensidade(r.intensidade)}">${r.intensidade}/10</span>
            </div>
            <div class="pv-painel-hoje-hora">${hora}</div>
          </div>`;
      }).join('');
    }

    return { abrir, atualizar: atualizarSeAberto };
  }

  /* =========================================================
   ÍCONES DO MENU DE SINTOMAS
   ========================================================= */

function iconeMenuSintomas(nome) {

  const caminhos = {

    inicio:
      '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',

    sintomas:
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16.5A1.5 1.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5V5.5Z"/>'
      + '<path d="M7.5 7H15.5M7.5 10.5H15.5M7.5 14H12"/>'
      + '<path d="M16.5 15.5v4M14.5 17.5h4"/>',

    conteudos:
      '<path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v12.5H8A2.5 2.5 0 0 1 5.5 17V5A.5.5 0 0 1 6 4.5Z"/>'
      + '<path d="M8.5 8h6M8.5 11.5h6M8.5 15h4"/>',

    prontuario:
      '<rect x="5" y="3" width="14" height="18" rx="2.5"/>'
      + '<path d="M9 7.5h6M9 11h6M9 14.5h3"/>',

    usuario:
      '<circle cx="12" cy="8" r="4"/>'
      + '<path d="M4 21a8 8 0 0 1 16 0"/>',

    sino:
      '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>'
      + '<path d="M10 21h4"/>',

    sair:
      '<path d="M10 17l5-5-5-5M15 12H3"/>'
      + '<path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>'

  };

  const caminho = caminhos[nome] || '';

  return `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${caminho}
    </svg>
  `;

}


  /* ======================================================= MenuSintomas === */
  async function menuSintomas(main, ctx) {

    /*
     * Esta rota utiliza o layout próprio do paciente.
     * O header/footer global continuam escondidos aqui.
     */
  
    const header =
      document.getElementById('app-header');
  
    const footer =
      document.getElementById('app-footer');
  
    if (header) {
      header.hidden = true;
    }
  
    if (footer) {
      footer.hidden = true;
    }
  
  
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-menu-sintomas-main');
  
  
    main.innerHTML = `
  
      <div class="pv-menu-sintomas-modern">
  
        <!-- =========================================================
             SIDEBAR DESKTOP
             ========================================================= -->
  
        <aside
          class="pv-sidebar pv-sintomas-sidebar"
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
                class="pv-sidebar-item"
                type="button"
                data-rota="/home"
              >
                ${iconeMenuSintomas('inicio')}
                <span>Início</span>
              </button>
  
  
              <button
                class="pv-sidebar-item active"
                type="button"
                data-rota="/menu-sintomas"
              >
                ${iconeMenuSintomas('sintomas')}
                <span>Sintomas</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/busca"
              >
                ${iconeMenuSintomas('conteudos')}
                <span>Conteúdos</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/perfil"
              >
                ${iconeMenuSintomas('prontuario')}
                <span>Prontuário</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/perfil"
              >
                ${iconeMenuSintomas('usuario')}
                <span>Perfil</span>
              </button>
  
            </nav>
  
          </div>
  
  
          <!-- PERFIL / SAIR -->
  
          <div class="pv-sidebar-footer">
  
            <div class="pv-sidebar-profile">
  
              <span class="pv-sidebar-avatar">
                ${iconeMenuSintomas('usuario')}
              </span>
  
              <span class="pv-sidebar-profile-text">
  
                <strong id="pv-sintomas-sidebar-name">
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
  
              ${iconeMenuSintomas('sair')}
  
              <span>
                Sair
              </span>
  
            </button>
  
          </div>
  
        </aside>
  
  
        <!-- =========================================================
             ÁREA DIREITA
             ========================================================= -->
  
        <section class="pv-sintomas-workspace">
  
  
          <!-- TOPBAR -->
  
          <header class="pv-sintomas-topbar">
  
            <span class="pv-sintomas-demo">
              Protótipo demonstrativo
            </span>
  
  
            <button
              type="button"
              class="pv-sintomas-topbar-icon"
              data-rota="/busca"
              aria-label="Pesquisar conteúdos"
            >
  
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
  
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                ></circle>
  
                <path
                  d="m16 16 4.5 4.5"
                ></path>
  
              </svg>
  
            </button>
  
  
            <button
              type="button"
              class="pv-sintomas-topbar-icon pv-sintomas-notificacao"
              data-rota="/triagem"
              aria-label="Abrir triagem"
            >
  
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
  
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                ></path>
  
                <path
                  d="M10 21h4"
                ></path>
  
              </svg>
  
              <span
                class="pv-sintomas-notificacao-dot"
                aria-hidden="true"
              ></span>
  
            </button>
  
          </header>
  
  
          <!-- =======================================================
               CONTEÚDO
               ======================================================= -->
  
          <main class="pv-sintomas-content">
  
  
            <!-- TÍTULO -->
  
            <section class="pv-sintomas-heading">
  
              <div>
  
                <span class="pv-page-eyebrow">
                  Registro de hoje
                </span>
  
                <h1>
                  Como você está se sentindo?
                </h1>
  
                <p>
                  Escolha um sintoma para consultar ou
                  registrar sua intensidade.
                </p>
  
              </div>
  
  
              <button
                type="button"
                class="pv-sintomas-historico"
                id="btn-historico"
              >
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
  
                  <path
                    d="M6 4h12v16H6z"
                  ></path>
  
                  <path
                    d="M9 8h6M9 12h6M9 16h3"
                  ></path>
  
                </svg>
  
                Histórico
  
              </button>
  
            </section>
  
  
            <div class="pv-sintomas-divider"></div>
  
  
            <!-- BUSCA -->
  
            <div class="pv-sintomas-search">
  
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
  
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                ></circle>
  
                <path
                  d="m16 16 4.5 4.5"
                ></path>
  
              </svg>
  
  
              <input
                id="pv-busca-sintoma"
                type="search"
                placeholder="Buscar sintoma"
                autocomplete="off"
                aria-label="Buscar sintoma"
              >
  
            </div>
  
  
            <!-- LISTA -->
  
            <section
              id="lista-sintomas-slot"
              class="pv-sintomas-lista"
            >
            </section>
  
  
          </main>
  
  
          <!-- =======================================================
               MOBILE NAV
               ======================================================= -->
  
          <nav
            class="pv-sintomas-mobile-nav"
            aria-label="Navegação principal"
          >
  
            <button
              type="button"
              data-rota="/home"
            >
              ${iconeMenuSintomas('inicio')}
              <span>Início</span>
            </button>
  
  
            <button
              type="button"
              class="active"
              data-rota="/menu-sintomas"
            >
              ${iconeMenuSintomas('sintomas')}
              <span>Sintomas</span>
            </button>
  
  
            <button
              type="button"
              data-rota="/triagem"
            >
              ${iconeMenuSintomas('triagem')}
              <span>Triagem</span>
            </button>
  
  
            <button
              type="button"
              data-rota="/perfil"
            >
              ${iconeMenuSintomas('usuario')}
              <span>Perfil</span>
            </button>
  
          </nav>
  
        </section>
  
      </div>
    `;
  
  
    /*
     * Logout da sidebar.
     */
  
    const layout =
      main.querySelector(
        '.pv-menu-sintomas-modern'
      );
  
    PV.ui.ligarLogout(layout);
  
  
    /*
     * Navegação.
     */
  
    main
      .querySelectorAll('[data-rota]')
      .forEach((botao) => {
  
        botao.addEventListener(
          'click',
          () => {
  
            PV.router.navegar(
              botao.dataset.rota
            );
  
          }
        );
  
      });
  
  
    /*
     * Histórico continua apontando para o acompanhamento
     * atual do sistema.
     */
  
    main
      .querySelector('#btn-historico')
      .addEventListener(
        'click',
        () => PV.router.navegar('/perfil')
      );
  
  
    /*
     * Nome do paciente na sidebar.
     * É apenas leitura e não altera nenhuma regra.
     */
  
    PV.db.pacientes
      .buscar(ctx.usuario.id)
      .then((paciente) => {
  
        const nome =
          paciente.nome_social ||
          paciente.nome ||
          'Paciente';
  
        const elemento =
          main.querySelector(
            '#pv-sintomas-sidebar-name'
          );
  
        if (elemento) {
          elemento.textContent = nome;
        }
  
      })
      .catch(() => {
        /*
         * Caso não consiga carregar o nome,
         * permanece "Paciente".
         */
      });
  
  
    /*
     * Componentes existentes.
     */
  
    const painelHoje =
      montarPainelHoje(
        main,
        ctx
      );
  
  
    const modal =
      montarModalIntensidade(
        main,
        ctx,
        () => painelHoje.atualizar()
      );
  
  
    /*
     * Carrega a lista real.
     */
  
    await montarListaSintomas(
      main.querySelector(
        '#lista-sintomas-slot'
      ),
      (sintoma) =>
        modal.abrir(sintoma)
    );
  
  }

  /* ==================================================== ConteudoDetalhe === */
  async function conteudoDetalhe(main, ctx) {

    /*
     * Esta rota passa a usar o mesmo padrão visual das telas
     * Home / Menu de Sintomas:
     * sidebar desktop + workspace + topbar + navegação mobile.
     *
     * A lógica clínica permanece a mesma.
     */
  
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
  
    if (header) {
      header.hidden = true;
      header.innerHTML = '';
    }
  
    if (footer) {
      footer.hidden = true;
      footer.innerHTML = '';
    }
  
    main.classList.remove('pv-sem-scroll');
    main.classList.add('pv-conteudo-detalhe-main');
  
    /*
     * Estado inicial de carregamento.
     */
  
    main.innerHTML = `
      <div class="pv-conteudo-detalhe-loading">
        ${spinner()}
        <span>Carregando informações...</span>
      </div>
    `;
  
  
    /*
     * Busca o conteúdo real.
     */
  
    let conteudo = null;
    let erro = null;
  
    try {
  
      conteudo =
        await PV.db.conteudos.buscar(ctx.sub);
  
    } catch (e) {
  
      erro =
        e.message ||
        'Erro ao carregar conteúdo.';
  
    }
  
  
    /*
     * Conteúdo inexistente.
     */
  
    if (!conteudo) {
  
      main.innerHTML = `
        <div class="pv-conteudo-detalhe-modern">
  
          <div class="pv-conteudo-detalhe-estado">
            <div class="pv-conteudo-detalhe-estado-icon">
              !
            </div>
  
            <h1>Conteúdo não encontrado</h1>
  
            <p>
              Não foi possível carregar as informações deste sintoma.
            </p>
  
            <button
              type="button"
              class="pv-conteudo-voltar"
              id="btn-voltar"
            >
              Voltar aos sintomas
            </button>
  
          </div>
  
        </div>
      `;
  
      main
        .querySelector('#btn-voltar')
        .addEventListener(
          'click',
          () => PV.router.navegar('/menu-sintomas')
        );
  
      return;
    }
  
  
    /*
     * Layout principal.
     */
  
    main.innerHTML = `
  
      <div class="pv-conteudo-detalhe-modern">
  
        <!-- =========================================================
             SIDEBAR DESKTOP
             ========================================================= -->
  
        <aside
          class="pv-sidebar pv-conteudo-sidebar"
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
                class="pv-sidebar-item"
                type="button"
                data-rota="/home"
              >
                ${iconeMenuSintomas('inicio')}
                <span>Início</span>
              </button>
  
  
              <button
                class="pv-sidebar-item active"
                type="button"
                data-rota="/menu-sintomas"
              >
                ${iconeMenuSintomas('sintomas')}
                <span>Sintomas</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/busca"
              >
                ${iconeMenuSintomas('conteudos')}
                <span>Conteúdos</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/perfil"
              >
                ${iconeMenuSintomas('prontuario')}
                <span>Prontuário</span>
              </button>
  
  
              <button
                class="pv-sidebar-item"
                type="button"
                data-rota="/perfil"
              >
                ${iconeMenuSintomas('usuario')}
                <span>Perfil</span>
              </button>
  
            </nav>
  
          </div>
  
  
          <!-- PERFIL / SAIR -->
  
          <div class="pv-sidebar-footer">
  
            <div class="pv-sidebar-profile">
  
              <span class="pv-sidebar-avatar">
                ${iconeMenuSintomas('usuario')}
              </span>
  
              <span class="pv-sidebar-profile-text">
  
                <strong id="pv-conteudo-sidebar-name">
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
  
              ${iconeMenuSintomas('sair')}
  
              <span>
                Sair
              </span>
  
            </button>
  
          </div>
  
        </aside>
  
  
        <!-- =========================================================
             WORKSPACE
             ========================================================= -->
  
        <section class="pv-conteudo-workspace">
  
  
          <!-- TOPBAR -->
  
          <header class="pv-conteudo-topbar">
  
            <button
              type="button"
              class="pv-conteudo-topbar-back"
              id="btn-voltar-topo"
              aria-label="Voltar aos sintomas"
            >
  
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5"></path>
                <path d="m11 18-6-6 6-6"></path>
              </svg>
  
              <span>Voltar aos sintomas</span>
  
            </button>
  
  
            <div class="pv-conteudo-topbar-right">
  
              <span class="pv-conteudo-demo">
                Protótipo demonstrativo
              </span>
  
              <button
                type="button"
                class="pv-conteudo-topbar-icon"
                data-rota="/busca"
                aria-label="Pesquisar conteúdos"
              >
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                  ></circle>
  
                  <path
                    d="m16 16 4.5 4.5"
                  ></path>
                </svg>
  
              </button>
  
              <button
                type="button"
                class="pv-conteudo-topbar-icon"
                data-rota="/triagem"
                aria-label="Abrir triagem"
              >
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
  
                  <path
                    d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                  ></path>
  
                  <path
                    d="M10 21h4"
                  ></path>
  
                </svg>
  
                <span
                  class="pv-conteudo-notificacao-dot"
                  aria-hidden="true"
                ></span>
  
              </button>
  
            </div>
  
          </header>
  
  
          <!-- =======================================================
               CONTEÚDO
               ======================================================= -->
  
          <main class="pv-conteudo-content">
  
            <div class="pv-conteudo-page-header">
  
              <span class="pv-page-eyebrow">
                INFORMAÇÕES SOBRE O SINTOMA
              </span>
  
              <h1>
                ${escaparHtml(conteudo.titulo)}
              </h1>
  
              <p>
                Entenda o que este sintoma significa,
                quais sinais observar e quando procurar ajuda.
              </p>
  
            </div>
  
  
            <!-- =====================================================
                 O QUE É
                 ===================================================== -->
  
            <section class="pv-conteudo-card pv-conteudo-card-main">
  
              <div class="pv-conteudo-card-icon pv-conteudo-card-icon-teal">
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
  
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  ></circle>
  
                  <path
                    d="M12 10v6"
                  ></path>
  
                  <circle
                    cx="12"
                    cy="7"
                    r=".8"
                    fill="currentColor"
                    stroke="none"
                  ></circle>
  
                </svg>
  
              </div>
  
  
              <div class="pv-conteudo-card-body">
  
                <span class="pv-conteudo-card-eyebrow">
                  O QUE É?
                </span>
  
                <h2>
                  Sobre este sintoma
                </h2>
  
                <p>
                  ${escaparHtml(
                    conteudo.descricao ||
                    conteudo.texto ||
                    'Informação não disponível.'
                  )}
                </p>
  
              </div>
  
            </section>
  
  
            <!-- =====================================================
                 SINAIS E SINTOMAS
                 ===================================================== -->
  
            <section class="pv-conteudo-card pv-conteudo-card-warning">
  
              <div class="pv-conteudo-card-body">
  
                <div class="pv-conteudo-card-heading">
  
                  <div>
  
                    <span class="pv-conteudo-card-eyebrow">
                      ATENÇÃO
                    </span>
  
                    <h2>
                      Sinais e sintomas
                    </h2>
  
                  </div>
  
                  <span class="pv-conteudo-status-dot pv-conteudo-status-yellow"></span>
  
                </div>
  
                <p>
                  ${escaparHtml(
                    conteudo.SinaisSintomas ||
                    'Informação não disponível.'
                  )}
                </p>
  
                <button
                  type="button"
                  class="pv-conteudo-action pv-conteudo-action-warning"
                  id="btn-amarelo"
                >
  
                  <span>
                    Estou sentindo estes sinais
                  </span>
  
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m13 6 6 6-6 6"></path>
                  </svg>
  
                </button>
  
              </div>
  
            </section>
  
  
            <!-- =====================================================
                 SINAIS DE ALERTA
                 ===================================================== -->
  
            <section class="pv-conteudo-card pv-conteudo-card-danger">
  
              <div class="pv-conteudo-card-body">
  
                <div class="pv-conteudo-card-heading">
  
                  <div>
  
                    <span class="pv-conteudo-card-eyebrow">
                      SINAL DE ALERTA
                    </span>
  
                    <h2>
                      Sinais de alerta
                    </h2>
  
                  </div>
  
                  <span class="pv-conteudo-status-dot pv-conteudo-status-red"></span>
  
                </div>
  
                <p>
                  ${escaparHtml(
                    conteudo.SinaisAlerta ||
                    'Informação não disponível.'
                  )}
                </p>
  
                <button
                  type="button"
                  class="pv-conteudo-action pv-conteudo-action-danger"
                  id="btn-vermelho"
                >
  
                  <span>
                    Estou sentindo estes sinais de alerta
                  </span>
  
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m13 6 6 6-6 6"></path>
                  </svg>
  
                </button>
  
              </div>
  
            </section>
  
  
            <!-- =====================================================
                 LEITURA FÁCIL
                 ===================================================== -->
  
            <section class="pv-conteudo-easy">
  
              <div class="pv-conteudo-easy-icon">
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
  
                  <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 1 4 16.5v-11Z"
                  ></path>
  
                  <path
                    d="M8 7h8M8 10.5h8M8 14h5"
                  ></path>
  
                </svg>
  
              </div>
  
              <div>
  
                <strong>
                  Prefere uma explicação mais simples?
                </strong>
  
                <p>
                  Consulte este conteúdo em modo de leitura fácil.
                </p>
  
              </div>
  
              <button
                type="button"
                id="btn-leitura-facil"
                aria-label="Abrir leitura fácil"
              >
  
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m13 6 6 6-6 6"></path>
                </svg>
  
              </button>
  
            </section>
  
  
            <button
              type="button"
              class="pv-conteudo-bottom-back"
              id="btn-voltar"
            >
              Voltar aos sintomas
            </button>
  
          </main>
  
  
          <!-- =======================================================
               MOBILE NAV
               ======================================================= -->
  
          <nav
            class="pv-conteudo-mobile-nav"
            aria-label="Navegação principal"
          >
  
            <button
              type="button"
              data-rota="/home"
            >
              ${iconeMenuSintomas('inicio')}
              <span>Início</span>
            </button>
  
            <button
              type="button"
              class="active"
              data-rota="/menu-sintomas"
            >
              ${iconeMenuSintomas('sintomas')}
              <span>Sintomas</span>
            </button>
  
            <button
              type="button"
              data-rota="/triagem"
            >
              ${iconeMenuSintomas('sino')}
              <span>Triagem</span>
            </button>
  
            <button
              type="button"
              data-rota="/perfil"
            >
              ${iconeMenuSintomas('usuario')}
              <span>Perfil</span>
            </button>
  
          </nav>
  
        </section>
  
      </div>
    `;
  
  
    /*
     * Logout.
     */
  
    const layout =
      main.querySelector(
        '.pv-conteudo-detalhe-modern'
      );
  
    PV.ui.ligarLogout(layout);
  
  
    /*
     * Navegação por data-rota.
     */
  
    main
      .querySelectorAll('[data-rota]')
      .forEach((botao) => {
  
        botao.addEventListener(
          'click',
          () => {
  
            PV.router.navegar(
              botao.dataset.rota
            );
  
          }
        );
  
      });
  
  
    /*
     * Nome do paciente.
     */
  
    PV.db.pacientes
      .buscar(ctx.usuario.id)
      .then((paciente) => {
  
        const nome =
          paciente.nome_social ||
          paciente.nome ||
          'Paciente';
  
        const elemento =
          main.querySelector(
            '#pv-conteudo-sidebar-name'
          );
  
        if (elemento) {
          elemento.textContent = nome;
        }
  
      })
      .catch(() => {
        /*
         * Mantém "Paciente" caso ocorra algum erro.
         */
      });
  
  
    /*
     * Voltar.
     */
  
    const voltar =
      () => PV.router.navegar(
        '/menu-sintomas'
      );
  
    main
      .querySelector('#btn-voltar')
      .addEventListener(
        'click',
        voltar
      );
  
    main
      .querySelector('#btn-voltar-topo')
      .addEventListener(
        'click',
        voltar
      );
  
  
    /*
     * Sinais e sintomas -> semáforo amarelo.
     */
  
    main
      .querySelector('#btn-amarelo')
      .addEventListener(
        'click',
        () => PV.router.navegar(
          '/sinal/amarelo'
        )
      );
  
  
    /*
     * Sinais de alerta -> semáforo vermelho.
     */
  
    main
      .querySelector('#btn-vermelho')
      .addEventListener(
        'click',
        () => PV.router.navegar(
          '/sinal/vermelho'
        )
      );
  
  
    /*
     * Leitura fácil -> definição.
     */
  
    main
      .querySelector('#btn-leitura-facil')
      .addEventListener(
        'click',
        () => PV.router.navegar(
          '/definicao/' + conteudo.id
        )
      );
  }

  /* ================================================== DefinicaoSintomas === */
  async function definicaoSintomas(main, ctx) {
    main.innerHTML = `<div class="pv-carregando" style="min-height:100%;background:var(--areia)">${PV.ui.spinner()}<span>Carregando...</span></div>`;

    let conteudo = null;
    try {
      if (ctx.sub) conteudo = await PV.db.conteudos.buscar(ctx.sub);
    } catch {
      conteudo = null;
    }

    if (!conteudo) {
      main.innerHTML = `<div class="pv-carregando" style="min-height:100%;background:var(--areia)"><span>Conteúdo não encontrado.</span></div>`;
      return;
    }

    main.innerHTML = `
      <div class="tela-definicao">
        <div class="conteudo">
          <h1 class="titulo">${escaparHtml(conteudo.titulo)}</h1>
          <div class="sublinhado"></div>

          <div class="titulo-definicao">Definição: <span class="peso-normal">${escaparHtml(conteudo.descricao || conteudo.texto)}</span></div>

          <div class="secao">
            <div class="titulo-secao">Sinais e Sintomas: </div>
            <div class="texto-secao">${escaparHtml(conteudo.SinaisSintomas)}</div>
          </div>

          <button type="button" class="botao-laranja" id="btn-amarelo">Sinto um ou mais
dos sinais e sintomas</button>

          <div class="secao">
            <div class="titulo-secao">Sinais de Alerta: </div>
            <div class="texto-secao">${escaparHtml(conteudo.SinaisAlerta)}</div>
          </div>

          <button type="button" class="botao-vermelho" id="btn-vermelho">Sinto um ou mais
dos sinais de alerta</button>
        </div>
      </div>`;

    main.querySelector('#btn-amarelo').addEventListener('click', () => PV.router.navegar('/sinal/amarelo'));
    main.querySelector('#btn-vermelho').addEventListener('click', () => PV.router.navegar('/sinal/vermelho'));
  }

  /* ============================================================= Sinal === */
  const SINAIS = {
    verde: {
      fundo: 'var(--verde)', corTitulo: 'var(--verde)',
      aviso: 'Tudo certo por hoje', titulo: 'Ótima notícia! Nenhum sintoma hoje',
      descricao: 'Ficamos felizes em saber que você está sem sintomas no momento. Em cuidados paliativos, cada dia de estabilidade é uma vitória. Continue seguindo as orientações da equipe de saúde e mantendo seus cuidados diários. Qualquer alteração deverá buscar atendimento médico.',
    },
    amarelo: {
      fundo: 'var(--amarelo)', corTitulo: 'var(--amarelo)',
      aviso: 'Atenção', titulo: 'Alguns sintomas exigem cuidado',
      descricao: 'Observamos sinais que merecem atenção. É importante monitorar qualquer mudança e comunicar a equipe de saúde. Comunique seu médico.',
    },
    vermelho: {
      fundo: 'var(--vermelho)', corTitulo: 'var(--vermelho)',
      aviso: 'Atenção', titulo: 'Sintomas podem indicar agravamento',
      descricao: 'Os sinais relatados indicam que seu estado de saúde pode estar se agravando. Procure atendimento médico!',
    },
  };

  async function sinal(main, ctx) {
    const conteudo = SINAIS[ctx.sub] || SINAIS.verde;
    main.innerHTML = `
      <div class="tela-sinal" style="background:${conteudo.fundo}">
        <div class="conteudo-scroll">
          <div class="aviso-topo" style="color:${conteudo.corTitulo}">${escaparHtml(conteudo.aviso)}</div>
          <div class="card">
            <div class="titulo">${escaparHtml(conteudo.titulo)}</div>
            <p class="descricao">${escaparHtml(conteudo.descricao)}</p>
          </div>
          <button type="button" class="botao-voltar" id="btn-voltar">Voltar ao início</button>
        </div>
      </div>`;

    main.querySelector('#btn-voltar').addEventListener('click', () => PV.router.navegar('/home?alerta=' + (ctx.sub || 'verde')));
  }

  PV.screens.menuSintomas = menuSintomas;
  PV.screens.conteudoDetalhe = conteudoDetalhe;
  PV.screens.definicaoSintomas = definicaoSintomas;
  PV.screens.sinal = sinal;
})();
