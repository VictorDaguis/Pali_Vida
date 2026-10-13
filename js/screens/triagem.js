/**
 * Triagem de sintomas e Laudo digital.
 *
 * Porta das funcionalidades de app.js do "PaliVida — Portal Clínico e Laudo
 * Digital" (busca de sintomas com sinônimos, medidor de nível de atenção,
 * visualizador de PDF local) para dentro do app-shell de telefone do
 * PaliVida, com a mesma paleta/fonte/componentes do restante do site (ver
 * css/styles.css, seção "Triagem / Carteirinha").
 *
 * O wizard de identificação (antiga "Carteirinha") foi unificado com a tela
 * de Prontuário — ver js/screens/perfil.js — para não haver duas telas com
 * o mesmo propósito. Os cards de condição mostram só o título, sem ícone —
 * nem emoji nem SVG — para manter a tela limpa.
 *
 * Disponível só para Paciente e Cuidador — o Administrador continua com o
 * Dashboard de sintomas e edita o conteúdo desta tela em "Entendendo os
 * sintomas" (tela /busca, "+ Novo Conteúdo") — ver router.js.
 *
 * IMPORTANTE — fonte dos dados: até esta versão, as condições exibidas aqui
 * vinham de um array fixo (DADOS_CLINICOS) só neste arquivo, sem relação
 * com o painel de administração. Agora os cards vêm de PV.db.conteudos
 * (mesma planilha do Google Sheets usada em /busca), para que o admin edite
 * a Triagem pelo botão "+ Novo Conteúdo"/"Editar". Isso muda o contrato de
 * dados: "SinaisSintomas" e "SinaisAlerta" (que na planilha são um texto
 * único por célula) viram a lista de itens marcáveis desta tela separando
 * o texto por ";" ou quebras de linha. Ao editar o conteúdo pelo admin,
 * cada sinal/sintoma/alerta deve ficar separado por ";" ou em uma linha.
 * Os campos "sinônimos" (busca por voz/texto) e "referências bibliográficas"
 * não existem na planilha — ficam vazios/ocultos nesta versão.
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};

(function () {
  const { escaparHtml, svgMic, aviso } = PV.ui;

  function dividirItens(texto) {
    return String(texto || '')
      .split(/[;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Converte um conteúdo vindo de PV.db.conteudos (mesmo formato usado na
  // tela /busca) para o formato de "condição clínica" que os cards da
  // Triagem esperam. `id` aqui precisa ser estável e único no HTML (usado
  // em seletores tipo #triagem-<id>): usamos "conteudo-<id numérico>".
  function paraCondicaoClinica(conteudo) {
    return {
      id: `conteudo-${conteudo.id}`,
      titulo: conteudo.titulo || '',
      definicao: conteudo.descricao || conteudo.texto || '',
      sinaisSintomas: dividirItens(conteudo.SinaisSintomas),
      sinaisAlerta: dividirItens(conteudo.SinaisAlerta),
      // Sinônimos e referências bibliográficas não existem na planilha —
      // a tela já lida bem com essas listas vazias (sem "Referências" ou
      // sem resultado extra na busca por sinônimo).
      sinonimos: [],
      referencias: [],
    };
  }

  /* =============================================================== Triagem === */
  async function triagem(main, ctx) {
    const selecionados = new Set();
    const selecionadosAlerta = new Set();
    let textoBusca = '';
    const tela = ctx.usuario?.tipo === 'paciente'
      ? PV.ui.montarLayoutPaciente(main, 'triagem')
      : main;
    const conteudosSemente = window.PALIVIDA_SEED?.conteudos || [];
    let DADOS_CLINICOS = conteudosSemente.map((conteudo, indice) => paraCondicaoClinica({
      ...conteudo,
      id: conteudo.id ?? indice + 1,
      descricao: conteudo.descricao ?? conteudo.texto ?? '',
      SinaisSintomas: conteudo.SinaisSintomas ?? conteudo.sinaissintomas ?? '',
      SinaisAlerta: conteudo.SinaisAlerta ?? conteudo.sinaisalerta ?? '',
    }));

    const requisicaoConteudos = PV.db.conteudos.listar({ timeoutMs: 20000 });

    function cardHtml(item) {
      const sintomasHtml = item.sinaisSintomas.map((s) => {
        const marcado = selecionados.has(s);
        return `<label class="pv-triagem-check${marcado ? ' selecionado' : ''}">
          <input type="checkbox" data-tipo="sintoma" data-item="${item.id}" value="${escaparHtml(s)}" ${marcado ? 'checked' : ''}>
          <span>${escaparHtml(s)}</span>
        </label>`;
      }).join('');

      const alertaHtml = item.sinaisAlerta.length ? `
        <div class="pv-triagem-alerta-secao">
          <div class="pv-triagem-rotulo alerta">Sinais de alerta — observou algum destes?</div>
          <div class="pv-triagem-grade">
            ${item.sinaisAlerta.map((a) => {
              const marcado = selecionadosAlerta.has(a);
              return `<label class="pv-triagem-check${marcado ? ' selecionado alerta' : ''}">
                <input type="checkbox" data-tipo="alerta" data-item="${item.id}" value="${escaparHtml(a)}" ${marcado ? 'checked' : ''}>
                <span>${escaparHtml(a)}</span>
              </label>`;
            }).join('')}
          </div>
        </div>` : '';

      const refsHtml = item.referencias.map((r) => `<li>${escaparHtml(r)}</li>`).join('');

      return `
        <div class="pv-triagem-card" id="triagem-${item.id}">
          <button type="button" class="pv-triagem-cabecalho" data-abrir="${item.id}">
            <span class="pv-triagem-titulo">${escaparHtml(item.titulo)}</span>
            <span class="pv-triagem-seta">▼</span>
          </button>
          <div class="pv-triagem-corpo">
            <p class="pv-triagem-definicao">${escaparHtml(item.definicao)}</p>
            <div class="pv-triagem-rotulo">Marque os sintomas observados:</div>
            <div class="pv-triagem-grade">${sintomasHtml}</div>
            ${alertaHtml}
            <details class="pv-triagem-refs">
              <summary>Referências bibliográficas</summary>
              <ul>${refsHtml}</ul>
            </details>
          </div>
        </div>`;
    }

    function medidorHtml() {
      const total = selecionados.size + selecionadosAlerta.size;
      if (!total) return '';

      let nivel, texto;
      if (selecionadosAlerta.size > 0 || selecionados.size >= 6) {
        nivel = 'vermelho';
        texto = '<strong>Atenção:</strong> sinais de alerta identificados. Identificamos que você possui sinais e sintomas que requerem avaliação médica. Busque orientação e atendimento médico';
      } else if (selecionados.size >= 3) {
        nivel = 'amarelo';
        texto = '<strong>Observação:</strong> múltiplos sintomas. Identificamos que você possui sinais e sintomas que requerem avaliação médica. Busque orientação e atendimento médico';
      } else {
        nivel = 'verde';
        texto = '<strong>Controle:</strong> Identificamos que você possui sinais e sintomas que requerem avaliação médica. Busque orientação e atendimento médico';
      }

      return `
        <div class="pv-triagem-medidor">
          <div class="pv-triagem-medidor-cabecalho">
            <button type="button" class="pv-triagem-limpar" id="triagem-limpar">Limpar</button>
          </div>
          <div class="pv-triagem-banner ${nivel}">${texto}</div>
        </div>`;
    }

    function sugestoesHtml(termo) {
      if (!termo) return '';
      const resultados = [];
      DADOS_CLINICOS.forEach((item) => {
        const bateTitulo = item.titulo.toLowerCase().includes(termo) || item.sinonimos.some((s) => s.toLowerCase().includes(termo));
        if (bateTitulo) resultados.push({ titulo: item.titulo, id: item.id, tipo: 'Condição' });
        item.sinaisSintomas.forEach((s) => {
          if (s.toLowerCase().includes(termo) && !resultados.some((r) => r.titulo === item.titulo)) {
            resultados.push({ titulo: `${s} (${item.titulo})`, id: item.id, tipo: 'Sintoma' });
          }
        });
      });
      if (!resultados.length) return '';
      return `<ul class="pv-triagem-sugestoes">${resultados.map((r) => `
        <li data-ir="${r.id}"><span>${escaparHtml(r.titulo)}</span><span class="pv-triagem-tag">${r.tipo}</span></li>`).join('')}</ul>`;
    }

    tela.innerHTML = `
      <div class="tela-triagem">
        <div class="pv-triagem-intro">
          <h1 class="titulo">O que você está sentindo hoje?</h1>
          <p class="subtitulo">Digite um sintoma ou toque em uma condição para ver mais.</p>
          <div class="pv-triagem-busca-wrap">
            <input class="pv-triagem-busca" id="triagem-busca" type="text" placeholder="Ex: dor, enjoo, ansiedade..." autocomplete="off">
            <button type="button" class="pv-triagem-mic" id="triagem-mic" aria-label="Buscar por voz" title="Buscar por voz">${svgMic(false)}</button>
          </div>
          <div id="triagem-sugestoes"></div>
          <div id="triagem-atualizacao"></div>
        </div>

        <div id="triagem-medidor">${medidorHtml()}</div>

        <div id="triagem-lista" class="pv-triagem-lista">
          ${DADOS_CLINICOS.length ? DADOS_CLINICOS.map(cardHtml).join('') : '<p class="lista-vazia">Nenhum sintoma cadastrado ainda.</p>'}
        </div>

        <div class="pv-triagem-links">
          <button type="button" class="pv-triagem-link" id="ir-carteirinha">Preencher meu prontuário</button>
          <button type="button" class="pv-triagem-link" id="ir-laudo">Abrir laudo em PDF salvo no aparelho</button>
        </div>
      </div>`;

    const listaEl = main.querySelector('#triagem-lista');
    const medidorEl = main.querySelector('#triagem-medidor');
    const sugestoesEl = main.querySelector('#triagem-sugestoes');
    const buscaEl = main.querySelector('#triagem-busca');

    function religarCard(id) {
      const wrap = document.createElement('div');
      wrap.innerHTML = cardHtml(DADOS_CLINICOS.find((i) => i.id === id));
      const novo = wrap.firstElementChild;
      const atual = main.querySelector(`#triagem-${id}`);
      const aberto = atual && atual.classList.contains('aberto');
      atual.replaceWith(novo);
      if (aberto) novo.classList.add('aberto');
      ligarCard(novo);
    }

    function ligarCard(cardEl) {
      cardEl.querySelector('[data-abrir]').addEventListener('click', () => cardEl.classList.toggle('aberto'));
      cardEl.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
        chk.addEventListener('change', () => {
          const tipo = chk.dataset.tipo;
          const valor = chk.value;
          if (tipo === 'sintoma') {
            chk.checked ? selecionados.add(valor) : selecionados.delete(valor);
          } else {
            chk.checked ? selecionadosAlerta.add(valor) : selecionadosAlerta.delete(valor);
          }
          religarCard(chk.dataset.item);
          medidorEl.innerHTML = medidorHtml();
          ligarMedidor();
        });
      });
    }

    function ligarMedidor() {
      const btn = main.querySelector('#triagem-limpar');
      if (!btn) return;
      btn.addEventListener('click', () => {
        selecionados.clear();
        selecionadosAlerta.clear();
        DADOS_CLINICOS.forEach((i) => religarCard(i.id));
        medidorEl.innerHTML = medidorHtml();
        ligarMedidor();
      });
    }

    function abrirCard(id) {
      const el = main.querySelector(`#triagem-${id}`);
      if (!el) return;
      el.classList.add('aberto');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      sugestoesEl.innerHTML = '';
    }

    function renderizarLista() {
      listaEl.innerHTML = DADOS_CLINICOS.length
        ? DADOS_CLINICOS.map(cardHtml).join('')
        : '<p class="lista-vazia">Nenhum sintoma cadastrado ainda.</p>';
      listaEl.querySelectorAll('.pv-triagem-card').forEach(ligarCard);
    }

    renderizarLista();
    ligarMedidor();
    main.querySelectorAll('[data-ir]').forEach((btn) => {
      btn.addEventListener('click', () => abrirCard(btn.dataset.ir));
    });

    buscaEl.addEventListener('input', () => {
      textoBusca = buscaEl.value.toLowerCase().trim();
      sugestoesEl.innerHTML = sugestoesHtml(textoBusca);
      sugestoesEl.querySelectorAll('[data-ir]').forEach((li) => li.addEventListener('click', () => {
        buscaEl.value = '';
        abrirCard(li.dataset.ir);
      }));
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = main.querySelector('#triagem-mic');
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      micBtn.addEventListener('click', () => {
        recognition.start();
        micBtn.classList.add('gravando');
        micBtn.innerHTML = svgMic(true);
      });
      recognition.addEventListener('result', (e) => {
        buscaEl.value = e.results[0][0].transcript.replace('.', '');
        buscaEl.dispatchEvent(new Event('input'));
      });
      recognition.addEventListener('end', () => { micBtn.classList.remove('gravando'); micBtn.innerHTML = svgMic(false); });
      recognition.addEventListener('error', () => { micBtn.classList.remove('gravando'); micBtn.innerHTML = svgMic(false); });
    } else {
      micBtn.style.display = 'none';
    }

    main.querySelector('#ir-carteirinha').addEventListener('click', () => PV.router.navegar('/perfil'));
    main.querySelector('#ir-laudo').addEventListener('click', () => PV.router.navegar('/laudo'));

    requisicaoConteudos.then((conteudos) => {
      if (!main.contains(listaEl)) return;
      DADOS_CLINICOS = conteudos.map(paraCondicaoClinica);
      renderizarLista();
      main.querySelector('#triagem-atualizacao').innerHTML = '';
    }).catch((e) => {
      if (!main.contains(listaEl)) return;
      const mensagemLocal = DADOS_CLINICOS.length
        ? `Não foi possível atualizar agora (${e.message || 'erro de conexão'}). Exibindo a lista local de referência.`
        : (e.message || 'Não foi possível carregar os sintomas.');
      main.querySelector('#triagem-atualizacao').innerHTML = aviso({
        tipo: 'erro',
        texto: mensagemLocal,
      });
    });
  }

  /* O wizard de identificação (antiga tela "Carteirinha") foi movido para
     dentro da tela de Prontuário — ver js/screens/perfil.js — para não haver
     duas telas com o mesmo propósito. Esta tela de Triagem só linka para lá. */

  /* ============================================================ LaudoDigital === */
  async function laudoDigital(main, ctx) {
    let blobUrl = null;
    let arquivoAtual = null;
    const ehAcompanhante = ctx.usuario?.tipo === 'acompanhante';
    const ehPaciente = ctx.usuario?.tipo === 'paciente';

    const headerGlobal = document.getElementById('app-header');
    const footerGlobal = document.getElementById('app-footer');
    if (headerGlobal) { headerGlobal.hidden = true; headerGlobal.innerHTML = ''; }
    if (footerGlobal) { footerGlobal.hidden = true; footerGlobal.innerHTML = ''; }

    main.classList.remove(
      'pv-sem-scroll',
      'pv-dashboard-paciente-main',
      'pv-menu-sintomas-main',
      'pv-conteudo-detalhe-main',
      'pv-sintoma-detalhe-main',
      'pv-sintoma-registro-main',
      'pv-cuidador-vinculos-main',
      'pv-cuidador-sintomas-main',
      'pv-cuidador-conteudos-main',
      'pv-cuidador-profile-main'
    );
    main.classList.add('pv-laudo-modern-main');

    const icone = (nome) => {
      const paths = {
        inicio: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        vinculos: '<path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15"/><path d="M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15"/>',
        sintomas: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
        conteudos: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/>',
        perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        sair: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
        busca: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
        sino: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
        laudo: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
        voltar: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
      };
      return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[nome] || ''}</svg>`;
    };

    const iniciais = (nome) => {
      const partes = String(nome || '').trim().split(/\s+/).filter(Boolean);
      if (!partes.length) return 'AC';
      return (partes.length > 1
        ? partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
        : partes[0].slice(0, 2)).toLocaleUpperCase('pt-BR');
    };

    const sidebarAcompanhante = `
      <aside class="pv-cuidador-sidebar" aria-label="Navegação do acompanhante">
        <div class="pv-cuidador-sidebar-top">
          <div class="pv-cuidador-brand"><a href="#/home" aria-label="PaliVida — início"><img src="assets/img/logo-completo.png" alt="PaliVida"></a></div>
          <div class="pv-cuidador-nav-label">MEU CUIDADO</div>
          <nav class="pv-cuidador-nav">
            <button type="button" class="pv-cuidador-nav-item" data-laudo-rota="/home">${icone('inicio')}<span>Início</span></button>
            <button type="button" class="pv-cuidador-nav-item" data-laudo-rota="/vinculos">${icone('vinculos')}<span>Vínculos</span></button>
            <button type="button" class="pv-cuidador-nav-item" data-laudo-rota="/sintomas">${icone('sintomas')}<span>Sintomas</span></button>
            <button type="button" class="pv-cuidador-nav-item" data-laudo-rota="/busca">${icone('conteudos')}<span>Conteúdos</span></button>
            <button type="button" class="pv-cuidador-nav-item active" data-laudo-rota="/perfil" aria-current="page">${icone('perfil')}<span>Perfil</span></button>
          </nav>
        </div>
        <div class="pv-cuidador-sidebar-footer">
          <div class="pv-cuidador-sidebar-profile">
            <span class="pv-cuidador-avatar" id="pv-laudo-acomp-avatar" aria-hidden="true">AC</span>
            <span class="pv-cuidador-profile-text"><strong id="pv-laudo-acomp-name">Acompanhante</strong><small>Acompanhante</small></span>
          </div>
          <button type="button" class="pv-cuidador-logout" data-sair>${icone('sair')}<span>Sair</span></button>
        </div>
      </aside>`;

    const sidebarPaciente = typeof PV.ui.sidebarPaciente === 'function'
      ? PV.ui.sidebarPaciente(ehPaciente ? 'perfil' : 'prontuario')
      : '';
    const sidebar = ehAcompanhante ? sidebarAcompanhante : sidebarPaciente;
    const rotuloVoltar = ehAcompanhante ? 'Voltar ao perfil' : 'Voltar aos sintomas';
    const rotaVoltar = ehAcompanhante ? '/perfil' : '/menu-sintomas';

    const navMobileAcompanhante = `
      <nav class="pv-laudo-mobile-nav is-acompanhante" aria-label="Navegação principal">
        <button type="button" data-laudo-rota="/home">${icone('inicio')}<span>Início</span></button>
        <button type="button" data-laudo-rota="/vinculos">${icone('vinculos')}<span>Vínculos</span></button>
        <button type="button" data-laudo-rota="/sintomas">${icone('sintomas')}<span>Sintomas</span></button>
        <button type="button" data-laudo-rota="/busca">${icone('conteudos')}<span>Conteúdos</span></button>
        <button type="button" class="active" data-laudo-rota="/perfil">${icone('perfil')}<span>Perfil</span></button>
      </nav>`;
    const navMobilePaciente = `
      <nav class="pv-laudo-mobile-nav" aria-label="Navegação principal">
        <button type="button" data-laudo-rota="/home">${icone('inicio')}<span>Início</span></button>
        <button type="button" data-laudo-rota="/menu-sintomas">${icone('sintomas')}<span>Sintomas</span></button>
        <button type="button" data-laudo-rota="/busca">${icone('conteudos')}<span>Conteúdos</span></button>
        <button type="button" class="active" data-laudo-rota="/meu-perfil">${icone('perfil')}<span>Perfil</span></button>
      </nav>`;

    main.innerHTML = `
      <div class="pv-laudo-modern-layout ${ehAcompanhante ? 'is-acompanhante' : 'is-paciente'}">
        ${sidebar}
        <section class="pv-laudo-modern-workspace">
          <header class="pv-laudo-modern-topbar">
            <strong>Meu cuidado</strong>
            <div class="pv-laudo-modern-topbar-actions">
              <span>Protótipo demonstrativo</span>
              <button type="button" data-laudo-rota="/busca" aria-label="Pesquisar conteúdos" title="Pesquisar conteúdos">${icone('busca')}</button>
              <span class="pv-laudo-modern-bell" aria-label="Notificações">${icone('sino')}<i aria-hidden="true"></i></span>
            </div>
          </header>

          <div class="pv-laudo-modern-content">
            <header class="pv-laudo-modern-heading">
              <span class="pv-laudo-modern-eyebrow">DOCUMENTOS DE SAÚDE</span>
              <h1>Laudo em PDF</h1>
              <p>Selecione um arquivo PDF do seu aparelho para consultar ou guardar uma cópia.</p>
            </header>

            <section class="pv-laudo-modern-upload-card">
              <span class="pv-laudo-modern-icon">${icone('laudo')}</span>
              <div class="pv-laudo-modern-upload-copy">
                <h2>Carregar documento</h2>
                <p>Escolha o laudo em PDF salvo no seu dispositivo. O arquivo selecionado será exibido nesta tela.</p>
                <small>Formato aceito: PDF</small>
              </div>
              <div class="pv-laudo-modern-upload-action">
                <label for="laudo-arquivo" class="pv-laudo-modern-file-button">${icone('laudo')}<span>Selecionar arquivo PDF</span></label>
                <input type="file" id="laudo-arquivo" accept="application/pdf,.pdf" class="pv-oculto">
              </div>
            </section>

            <div class="pv-laudo-modern-notice" role="note">
              ${icone('check')}<span>Por privacidade, este protótipo abre o arquivo escolhido no navegador; selecione “Abrir / salvar arquivo” para guardar uma cópia no dispositivo.</span>
            </div>

            <section id="laudo-visualizador" class="pv-laudo-modern-viewer pv-oculto" aria-live="polite">
              <header class="pv-laudo-modern-viewer-heading">
                <div><span class="pv-laudo-modern-eyebrow">DOCUMENTO SELECIONADO</span><h2 id="laudo-nome-arquivo">Visualizando documento</h2></div>
                <div class="pv-laudo-modern-viewer-actions">
                  <button type="button" class="pv-laudo-modern-button primary" id="laudo-abrir">${icone('laudo')}<span>Abrir / salvar arquivo</span></button>
                  <button type="button" class="pv-laudo-modern-button secondary" id="laudo-fechar">Fechar</button>
                </div>
              </header>
              <p class="pv-laudo-modern-mobile-hint">Se a visualização não funcionar no celular, use “Abrir / salvar arquivo”.</p>
              <div class="pv-laudo-modern-frame-wrap"><iframe id="laudo-frame" title="Visualizador de PDF"></iframe></div>
            </section>

            <div class="pv-laudo-modern-back-row">
              <button type="button" class="pv-laudo-modern-back" id="laudo-ir-voltar">${icone('voltar')}<span>${rotuloVoltar}</span></button>
            </div>
          </div>
        </section>
        ${ehAcompanhante ? navMobileAcompanhante : navMobilePaciente}
      </div>`;

    main.querySelectorAll('[data-laudo-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.laudoRota));
    });
    main.querySelectorAll('[data-rota]').forEach((botao) => {
      botao.addEventListener('click', () => PV.router.navegar(botao.dataset.rota));
    });
    if (PV.ui.ligarLogout) PV.ui.ligarLogout(main);

    // Nome e iniciais reais na identificação fixa da sidebar, sem alterar o nome cadastrado.
    if (ehAcompanhante && PV.db?.acompanhantes?.buscar) {
      PV.db.acompanhantes.buscar(ctx.usuario.id).then((dados) => {
        if (!main.isConnected || !dados) return;
        const nome = dados.nome_social || dados.nome_completo || 'Acompanhante';
        const nomeEl = main.querySelector('#pv-laudo-acomp-name');
        const avatarEl = main.querySelector('#pv-laudo-acomp-avatar');
        if (nomeEl) nomeEl.textContent = nome;
        if (avatarEl) avatarEl.textContent = iniciais(nome);
      }).catch(() => {});
    } else if (ehPaciente && PV.db?.pacientes?.buscar) {
      PV.db.pacientes.buscar(ctx.usuario.id).then((dados) => {
        if (!main.isConnected || !dados) return;
        const nomeEl = main.querySelector('#pv-sidebar-paciente-name');
        if (nomeEl) nomeEl.textContent = dados.nome_social || dados.nome || 'Paciente';
      }).catch(() => {});
    }

    const inputEl = main.querySelector('#laudo-arquivo');
    const visualizadorEl = main.querySelector('#laudo-visualizador');
    const frameEl = main.querySelector('#laudo-frame');
    const nomeArquivoEl = main.querySelector('#laudo-nome-arquivo');

    inputEl.addEventListener('change', (evento) => {
      const arquivo = evento.target.files && evento.target.files[0];
      if (!arquivo) return;
      const pdfPeloNome = /\.pdf$/i.test(arquivo.name || '');
      if (arquivo.type !== 'application/pdf' && !(!arquivo.type && pdfPeloNome)) {
        alert('Por favor, selecione um arquivo válido no formato PDF.');
        inputEl.value = '';
        return;
      }
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      arquivoAtual = arquivo;
      blobUrl = URL.createObjectURL(arquivo);
      frameEl.src = blobUrl;
      nomeArquivoEl.textContent = arquivo.name || 'Documento PDF';
      visualizadorEl.classList.remove('pv-oculto');
      visualizadorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    main.querySelector('#laudo-abrir').addEventListener('click', (evento) => {
      evento.preventDefault();
      if (!blobUrl || !arquivoAtual) return;
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = arquivoAtual.name || 'meu-laudo.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    main.querySelector('#laudo-fechar').addEventListener('click', () => {
      frameEl.src = 'about:blank';
      if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
      arquivoAtual = null;
      inputEl.value = '';
      nomeArquivoEl.textContent = 'Visualizando documento';
      visualizadorEl.classList.add('pv-oculto');
    });

    main.querySelector('#laudo-ir-voltar').addEventListener('click', () => PV.router.navegar(rotaVoltar));
    window.addEventListener('hashchange', () => {
      if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
    }, { once: true });
  }

  PV.screens.triagem = triagem;
  PV.screens.laudoDigital = laudoDigital;
})();
