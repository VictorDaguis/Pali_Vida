/**
 * PaliVida — Autenticação
 *
 * Login responsivo para desktop e celular, mantendo a lógica existente
 * de autenticação, recuperação de senha e acesso às contas de demonstração.
 *
 * Cadastro permanece com a lógica atual e continua usando as classes
 * existentes da aplicação.
 */
window.PV = window.PV || {};
window.PV.screens = window.PV.screens || {};

(function () {
  const { escaparHtml, headerLogin, aviso, spinner } = PV.ui;

  /* ================================================================ Login === */
  async function login(main, ctx) {
    let modoRecuperar = false;
    function templateLogin() {

      return `
    
        <div class="pv-login-lovable">
    
          <!-- =====================================================
               LADO ESQUERDO
               ===================================================== -->
    
          <aside class="pv-login-brand">
    
            <div class="pv-login-brand-top">
    
              <a
                href="#/login"
                class="pv-login-logo"
                aria-label="PaliVida"
              >
    
                <span class="pv-login-logo-icon">
                  P
                </span>
    
                <span class="pv-login-logo-text">
                  PaliVida
                </span>
    
              </a>
    
            </div>
    
    
            <div class="pv-login-brand-middle">
    
              <div class="pv-login-brand-symbol">
    
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
    
                  <path
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                  />
    
                </svg>
    
              </div>
    
    
              <h1>
                Cuidado que acolhe.<br>
                Informação que<br>
                aproxima.
              </h1>
    
    
              <p>
                Um espaço simples e seguro para acompanhar
                o cuidado, no seu tempo.
              </p>
    
            </div>
    
    
            <div class="pv-login-brand-bottom">
    
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
    
                <path
                  d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z"
                />
    
                <path
                  d="m8.5 12 2.2 2.2 4.8-5"
                />
    
              </svg>
    
              <span>
                Ambiente de demonstração protegido
              </span>
    
            </div>
    
          </aside>
    
    
          <!-- =====================================================
               LADO DIREITO
               ===================================================== -->
    
          <main class="pv-login-content">
    
            <div class="pv-login-form-area">
    
    
              <div class="pv-login-form-header">
    
                <span class="pv-login-eyebrow">
                  BEM-VINDO DE VOLTA
                </span>
    
                <h2>
                  Entrar
                </h2>
    
                <p>
                  Acesse sua conta para continuar no PaliVida.
                </p>
    
              </div>
    
    
              <div class="pv-login-form">
    
    
                <!-- E-MAIL -->
    
                <div class="pv-login-field">
    
                  <label for="login-email">
                    E-mail
                  </label>
    
                  <div class="pv-login-input-wrap">
    
                    <span
                      class="pv-login-input-icon"
                      aria-hidden="true"
                    >
    
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
    
                        <rect
                          x="4"
                          y="5"
                          width="16"
                          height="14"
                          rx="2"
                        />
    
                        <path
                          d="m5 7 7 5 7-5"
                        />
    
                      </svg>
    
                    </span>
    
    
                    <input
                      class="pv-login-input"
                      id="login-email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      autocomplete="email"
                      value="${escaparHtml(ctx.query.email || '')}"
                    >
    
                  </div>
    
                </div>
    
    
                <!-- SENHA -->
    
                <div class="pv-login-field">
    
                  <div class="pv-login-label-row">
    
                    <label for="login-senha">
                      Senha
                    </label>
    
                    <button
                      class="pv-login-forgot"
                      id="link-esqueci"
                      type="button"
                    >
                      Esqueceu sua senha?
                    </button>
    
                  </div>
    
    
                  <div class="pv-login-input-wrap">
    
                    <span
                      class="pv-login-input-icon"
                      aria-hidden="true"
                    >
    
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
    
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
    
                        <path
                          d="M8 10V7a4 4 0 0 1 8 0v3"
                        />
    
                      </svg>
    
                    </span>
    
    
                    <input
                      class="pv-login-input pv-login-password-input"
                      id="login-senha"
                      type="password"
                      placeholder="Digite sua senha"
                      autocomplete="current-password"
                    >
    
    
                    <button
                      class="pv-login-eye"
                      id="login-toggle-password"
                      type="button"
                      aria-label="Mostrar senha"
                      aria-pressed="false"
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
                          d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"
                        />
    
                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                        />
    
                      </svg>
    
                    </button>
    
                  </div>
    
                </div>
    
    
                <!-- AVISO -->
    
                <div
                  class="pv-login-message"
                  id="login-aviso"
                  aria-live="polite"
                ></div>
    
    
                <!-- ENTRAR -->
    
                <button
                  class="pv-auth-action-primary"
                  id="btn-entrar"
                  type="button"
                >
    
                  <span>
                    Entrar
                  </span>
    
                  <span aria-hidden="true">
                    →
                  </span>
    
                </button>
    
    
                <!-- DIVISOR -->
    
                <div class="pv-login-divider">
    
                  <span></span>
    
                  <small>
                    ou
                  </small>
    
                  <span></span>
    
                </div>
    
    
                <!-- CADASTRO -->
    
                <button
                  class="pv-auth-action-secondary"
                  id="link-cadastro"
                  type="button"
                >
    
                  <span>
                    Criar uma nova conta
                  </span>
    
                  <span
                    class="pv-login-secondary-icon"
                    aria-hidden="true"
                  >
                    +
                  </span>
    
                </button>
    
    
                <!-- SEGURANÇA -->
    
                <div class="pv-login-security">
    
                  <span class="pv-login-security-icon">
    
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
    
                      <path
                        d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z"
                      />
    
                      <path
                        d="m8.5 12 2.2 2.2 4.8-5"
                      />
    
                    </svg>
    
                  </span>
    
                  <div>
    
                    <strong>
                      Acesso seguro
                    </strong>
    
                    <small>
                      Seus dados são protegidos.
                    </small>
    
                  </div>
    
                </div>
    
    
                <!-- DEMO -->
    
                <details class="pv-login-demo">
    
                  <summary>
                    Entrar com uma conta de demonstração
                  </summary>
    
                  <p>
                    Escolha um perfil para acessar o sistema:
                  </p>
    
                  <div class="pv-login-demo-actions">
    
                    <button
                      type="button"
                      data-demo-account="paciente"
                    >
                      Paciente
                    </button>
    
                    <button
                      type="button"
                      data-demo-account="administrador"
                    >
                      Administrador
                    </button>
    
                    <button
                      type="button"
                      data-demo-account="acompanhante"
                    >
                      Cuidador
                    </button>
    
                  </div>
    
                  <small>
                    Senha para as três contas:
                    <code>palivida123</code>
                  </small>
    
                </details>
    
    
              </div>
    
            </div>
    
          </main>
    
        </div>
    
      `;
    }

    function templateRecuperar() {

      return `
    
        <div class="pv-auth-lovable pv-auth-recovery">
    
          <main class="pv-auth-main pv-auth-main-centered">
    
            <div class="pv-auth-mobile-logo">
    
              <img
                src="assets/img/logo-completo.png"
                alt="PaliVida"
              >
    
              <span>
                CUIDADO • CONFORTO • SEMPRE
              </span>
    
            </div>
    
    
            <section class="pv-auth-card pv-auth-recovery-card">
    
              <div class="pv-auth-card-header">
    
                <span class="pv-auth-eyebrow">
                  RECUPERAÇÃO DE ACESSO
                </span>
    
                <h2>
                  Recuperar senha
                </h2>
    
                <p>
                  Informe o e-mail cadastrado e enviaremos
                  as instruções para redefinir sua senha.
                </p>
    
              </div>
    
    
              <div class="pv-auth-form">
    
    
                <div class="pv-auth-field">
    
                  <label for="rec-email">
                    E-mail
                  </label>
    
                  <div class="pv-auth-input-wrap">
    
                    <span
                      class="pv-auth-input-icon"
                      aria-hidden="true"
                    >
    
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
    
                        <rect
                          x="4"
                          y="5"
                          width="16"
                          height="14"
                          rx="2"
                        />
    
                        <path
                          d="m5 7 7 5 7-5"
                        />
    
                      </svg>
    
                    </span>
    
                    <input
                      class="pv-auth-input"
                      id="rec-email"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      autocomplete="email"
                    >
    
                  </div>
    
                </div>
    
    
                <div
                  class="pv-auth-message"
                  id="rec-aviso"
                  aria-live="polite"
                ></div>
    
    
                <button
                  class="pv-auth-primary"
                  id="rec-enviar"
                  type="button"
                >
    
                  <span>
                    Enviar instruções
                  </span>
    
                  <span aria-hidden="true">
                    →
                  </span>
    
                </button>
    
    
                <button
                  class="pv-auth-back"
                  id="rec-voltar"
                  type="button"
                >
                  ← Voltar ao login
                </button>
    
    
                <div class="pv-auth-security">
    
                  <span class="pv-auth-security-icon">
    
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
    
                      <path
                        d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z"
                      />
    
                      <path
                        d="m8.5 12 2.2 2.2 4.8-5"
                      />
    
                    </svg>
    
                  </span>
    
                  <div>
    
                    <strong>
                      Privacidade e segurança
                    </strong>
    
                    <small>
                      Seu acesso é tratado de forma protegida.
                    </small>
    
                  </div>
    
                </div>
    
    
              </div>
    
            </section>
    
          </main>
    
        </div>
    
      `;
    }

    function montar() {
      main.innerHTML = modoRecuperar
        ? templateRecuperar()
        : templateLogin();

      if (modoRecuperar) {
        montarRecuperacao();
        return;
      }

      montarLogin();
    }

    function montarRecuperacao() {
      const recEmail = main.querySelector('#rec-email');
      const recAviso = main.querySelector('#rec-aviso');
      const botao = main.querySelector('#rec-enviar');

      main.querySelector('#rec-voltar').addEventListener('click', () => {
        modoRecuperar = false;
        montar();
      });

      recEmail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarRecuperacao();
      });

      botao.addEventListener('click', enviarRecuperacao);

      async function enviarRecuperacao() {
        const email = recEmail.value.trim();

        if (!email) {
          recAviso.innerHTML = aviso({
            tipo: 'erro',
            texto: 'Informe o e-mail cadastrado.',
          });
          recEmail.focus();
          return;
        }

        recAviso.innerHTML = '';
        botao.disabled = true;
        botao.innerHTML = spinner(true);

        try {
          await PV.db.auth.recuperarSenha(email);
          recAviso.innerHTML = aviso({
            tipo: 'sucesso',
            texto: 'Se este e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha.',
          });
        } catch (e) {
          recAviso.innerHTML = aviso({
            tipo: 'erro',
            texto: e.message || 'Não foi possível enviar o e-mail.',
          });
        } finally {
          botao.disabled = false;
          botao.textContent = 'Enviar instruções';
        }
      }
    }

    function montarLogin() {
      const campoEmail = main.querySelector('#login-email');
      const campoSenha = main.querySelector('#login-senha');
      const botao = main.querySelector('#btn-entrar');
      const toggleSenha = main.querySelector('#login-toggle-password');
      const contasDemo = window.PALIVIDA_SEED?.usuarios || {};

      main.querySelector('#link-esqueci').addEventListener('click', () => {
        modoRecuperar = true;
        montar();
      });

      main.querySelector('#link-cadastro').addEventListener('click', () => {
        PV.router.navegar('/cadastro');
      });

      toggleSenha.addEventListener('click', () => {
        const visivel = campoSenha.type === 'text';
        campoSenha.type = visivel ? 'password' : 'text';
        toggleSenha.setAttribute('aria-pressed', String(!visivel));
        toggleSenha.setAttribute(
          'aria-label',
          visivel ? 'Mostrar senha' : 'Ocultar senha',
        );
      });

      campoEmail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') entrar();
      });

      campoSenha.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') entrar();
      });

      botao.addEventListener('click', entrar);

      main.querySelectorAll('[data-demo-account]').forEach((botaoDemo) => {
        botaoDemo.addEventListener('click', () => {
          const conta = contasDemo[botaoDemo.dataset.demoAccount];
          const alvoAviso = main.querySelector('#login-aviso');

          if (!conta) {
            alvoAviso.innerHTML = aviso({
              tipo: 'erro',
              texto: 'Esta conta de demonstração não está disponível.',
            });
            return;
          }

          campoEmail.value = conta.email;
          campoSenha.value = conta.senha;
          entrar();
        });
      });

      async function entrar() {
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        const alvoAviso = main.querySelector('#login-aviso');

        if (!email || !senha) {
          alvoAviso.innerHTML = aviso({
            tipo: 'erro',
            texto: 'Preencha e-mail e senha.',
          });
          return;
        }

        alvoAviso.innerHTML = '';
        botao.disabled = true;
        botao.innerHTML = `
          <span class="pv-login-loading">
            ${spinner(true)}
          </span>
        `;

        try {
          const { token, user } = await PV.db.auth.login(
            email,
            senha,
          );

          PV.session.salvarSessao({
            token,
            usuario: user,
          });

          PV.router.navegar('/home');
        } catch (e) {
          alvoAviso.innerHTML = aviso({
            tipo: 'erro',
            texto:
              e.message ||
              'E-mail ou senha incorretos.',
          });

          botao.disabled = false;
          botao.innerHTML = `
            <span>Entrar</span>
            <span class="pv-login-arrow" aria-hidden="true">→</span>
          `;
        }
      }
    }

    montar();
  }

  /* ============================================================ Cadastro ===
     Cadastro simplificado: mantém a mesma lógica existente do projeto.
     Os dados adicionais continuam sendo preenchidos posteriormente no
     Prontuário Eletrônico.
  */
  const FORM_INICIAL = {
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    nome_social: '',
    telefone: '',
  };

  function formatarTelefone(v) {
    const d = v.replace(/\D/g, '');
    if (!d) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }

  function validarCadastro(form) {
    const obrigatorios = [
      ['nome', 'Preencha o nome completo.'],
      ['telefone', 'Preencha o telefone.'],
      ['email', 'Preencha o e-mail.'],
      ['senha', 'Preencha a senha.'],
    ];

    for (const [campo, msg] of obrigatorios) {
      if (!String(form[campo] || '').trim()) return msg;
    }

    if (form.senha.length < 6) {
      return 'A senha precisa ter ao menos 6 caracteres.';
    }

    if (form.senha !== form.confirmarSenha) {
      return 'As senhas não conferem.';
    }

    return null;
  }

  async function cadastro(main, ctx) {
    let etapa = 1;
    let form = { ...FORM_INICIAL };
    let enviando = false;
    let mensagem = null;

    function telaEtapa1() {

      return `
    
        <div class="pv-cadastro-lovable">
    
          <!-- =====================================================
               LADO ESQUERDO
               ===================================================== -->
    
          <aside class="pv-cadastro-brand">
    
            <div class="pv-cadastro-brand-top">
    
              <a
                href="#/login"
                class="pv-cadastro-logo"
                aria-label="PaliVida"
              >
    
                <span class="pv-cadastro-logo-icon">
                  P
                </span>
    
                <span class="pv-cadastro-logo-text">
                  PaliVida
                </span>
    
              </a>
    
            </div>
    
    
            <div class="pv-cadastro-brand-middle">
    
              <div class="pv-cadastro-brand-symbol">
    
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
    
                  <path
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                  />
    
                </svg>
    
              </div>
    
    
              <h1>
                Cuidado que acolhe.<br>
                Informação que<br>
                aproxima.
              </h1>
    
    
              <p>
                Um espaço simples e seguro para acompanhar
                o cuidado, no seu tempo.
              </p>
    
            </div>
    
    
            <div class="pv-cadastro-brand-bottom">
    
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
    
                <path
                  d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z"
                />
    
                <path
                  d="m8.5 12 2.2 2.2 4.8-5"
                />
    
              </svg>
    
              <span>
                Ambiente de demonstração protegido
              </span>
    
            </div>
    
          </aside>
    
    
          <!-- =====================================================
               LADO DIREITO
               ===================================================== -->
    
          <div class="pv-cadastro-content">
    
            <div class="pv-cadastro-form-area">
    
              <button
              type="button"
              class="pv-cadastro-voltar-topo"
              id="btn-voltar-login-topo"
              >
                ←&nbsp; Voltar
              </button>
    
    
              <div class="pv-cadastro-step-icon">
    
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
    
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                  />
    
                  <path
                    d="M4 21a8 8 0 0 1 16 0"
                  />
    
                  <path
                    d="M19 5v5M16.5 7.5h5"
                  />
    
                </svg>
    
              </div>
    
    
              <span class="pv-cadastro-eyebrow">
                NOVO ACESSO
              </span>
    
    
              <h2>
                Cadastre-se
              </h2>
    
    
              <p class="pv-cadastro-description">
                Comece criando seu acesso. Informações adicionais
                de saúde, contatos e equipe de cuidado poderão ser
                preenchidas depois no prontuário.
              </p>
    
    
              <button
                type="button"
                class="pv-cadastro-primary"
                id="btn-iniciar"
              >
    
                <span>
                  Iniciar cadastro
                </span>
    
                <span aria-hidden="true">
                  →
                </span>
    
              </button>
    
    
              <button
                type="button"
                class="pv-cadastro-secondary"
                id="btn-voltar-login"
              >
                Voltar ao login
              </button>
    
            </div>
    
          </div>
    
        </div>
    
      `;

    }

    function campoTexto(label, campo, opcoes = {}) {
      const {
        placeholder = '',
        tipo = 'text',
        maxlength = '',
      } = opcoes;
    
      return `
        <div class="pv-cadastro-field">
          <label class="campo-label" for="c-${campo}">
            ${escaparHtml(label)}
          </label>
    
          <input
            id="c-${campo}"
            class="campo"
            type="${escaparHtml(tipo)}"
            placeholder="${escaparHtml(placeholder)}"
            value="${escaparHtml(form[campo] || '')}"
            ${maxlength ? `maxlength="${escaparHtml(String(maxlength))}"` : ''}
            autocomplete="off"
          >
        </div>
      `;
    }

    function telaEtapa2() {

      return `
    
        <div class="pv-cadastro-lovable">
    
          <!-- =====================================================
               LADO ESQUERDO
               ===================================================== -->
    
          <aside class="pv-cadastro-brand">
    
            <div class="pv-cadastro-brand-top">
    
              <a
                href="#/login"
                class="pv-cadastro-logo"
                aria-label="PaliVida"
              >
    
                <span class="pv-cadastro-logo-icon">
                  P
                </span>
    
                <span class="pv-cadastro-logo-text">
                  PaliVida
                </span>
    
              </a>
    
            </div>
    
    
            <div class="pv-cadastro-brand-middle">
    
              <div class="pv-cadastro-brand-symbol">
    
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
    
                  <path
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                  />
    
                </svg>
    
              </div>
    
    
              <h1>
                Cuidado que acolhe.<br>
                Informação que<br>
                aproxima.
              </h1>
    
    
              <p>
                Um espaço simples e seguro para acompanhar
                o cuidado, no seu tempo.
              </p>
    
            </div>
    
    
            <div class="pv-cadastro-brand-bottom">
    
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
    
                <path
                  d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z"
                />
    
                <path
                  d="m8.5 12 2.2 2.2 4.8-5"
                />
    
              </svg>
    
              <span>
                Ambiente de demonstração protegido
              </span>
    
            </div>
    
          </aside>
    
    
          <!-- =====================================================
               LADO DIREITO
               ===================================================== -->
    
          <div class="pv-cadastro-content">
    
            <div class="pv-cadastro-form-area">
    
              <button
                type="button"
                class="pv-cadastro-voltar-topo"
                id="btn-voltar-etapa"
              >
                ←&nbsp; Voltar
              </button>
    
    
              <span class="pv-cadastro-eyebrow">
                ETAPA 2 DE 2
              </span>
    
    
              <h2>
                Criar acesso
              </h2>
    
    
              <div class="pv-cadastro-fields">
    
    
                ${campoTexto(
                  'Nome completo',
                  'nome',
                  {
                    placeholder: 'Seu nome'
                  }
                )}
    
    
                ${campoTexto(
                  'Nome social',
                  'nome_social',
                  {
                    placeholder: ''
                  }
                )}
    
                <span class="pv-cadastro-optional">
                  Opcional
                </span>
    
    
                ${campoTexto(
                  'Telefone',
                  'telefone',
                  {
                    placeholder: '(00) 00000-0000',
                    maxlength: 15
                  }
                )}
    
    
                ${campoTexto(
                  'E-mail',
                  'email',
                  {
                    placeholder: 'seuemail@exemplo.com',
                    tipo: 'email'
                  }
                )}
    
    
                <div class="pv-cadastro-password-grid">
    
                  <div>
    
                    ${campoTexto(
                      'Senha',
                      'senha',
                      {
                        placeholder: '',
                        tipo: 'password'
                      }
                    )}
    
                    <small class="pv-cadastro-help">
                      Mínimo de 6 caracteres
                    </small>
    
                  </div>
    
    
                  <div>
    
                    ${campoTexto(
                      'Confirmar senha',
                      'confirmarSenha',
                      {
                        placeholder: '',
                        tipo: 'password'
                      }
                    )}
    
                  </div>
    
                </div>
    
    
                <p class="pv-cadastro-required">
                  * Campo obrigatório
                </p>
    
    
                <div
                  id="cad-aviso"
                  class="pv-auth-message"
                >
                  ${mensagem ? aviso(mensagem) : ''}
                </div>
    
    
                <button
                  class="pv-cadastro-primary"
                  id="btn-finalizar"
                  type="button"
                >
    
                  <span>
                    Concluir cadastro
                  </span>
    
                  <span aria-hidden="true">
                    →
                  </span>
    
                </button> 
    
    
              </div>
    
            </div>
    
           </div>
    
        </div>
    
      `;
    }

    function ligarCamposTexto() {
      Object.keys(form).forEach((campo) => {
        const el = main.querySelector(`#c-${campo}`);
        if (!el) return;

        el.addEventListener('input', () => {
          if (campo === 'telefone') {
            el.value = formatarTelefone(el.value);
          }

          form[campo] = el.value;
        });
      });
    }

    function montar() {

      if (etapa === 1) {
    
        main.innerHTML = telaEtapa1();
    
    
        const btnIniciar =
          main.querySelector('#btn-iniciar');
    
        if (btnIniciar) {
    
          btnIniciar.addEventListener('click', () => {
    
            etapa = 2;
    
            montar();
    
          });
    
        }
    
    
        const btnVoltarLogin =
          main.querySelector('#btn-voltar-login');
    
        const btnVoltarTopo =
          main.querySelector('#btn-voltar-login-topo');
    
    
        if (btnVoltarLogin) {
    
          btnVoltarLogin.addEventListener('click', () => {
    
            PV.router.navegar('/login');
    
          });
    
        }
    
    
        if (btnVoltarTopo) {
    
          btnVoltarTopo.addEventListener('click', () => {
    
            PV.router.navegar('/login');
    
          });
    
        }
    
    
        return;
      }
    
    
      main.innerHTML = telaEtapa2();
    
      ligarCamposTexto();
    
    
      const btnVoltarEtapa =
        main.querySelector('#btn-voltar-etapa');
    
      if (btnVoltarEtapa) {
    
        btnVoltarEtapa.addEventListener('click', () => {
    
          etapa = 1;
    
          montar();
    
        });
    
      }
    
    
      const btnFinalizar =
        main.querySelector('#btn-finalizar');
    
      if (btnFinalizar) {
    
        btnFinalizar.addEventListener('click', enviar);
    
      }
    
    }

    async function enviar() {
      if (enviando) return;

      const erroValidacao = validarCadastro(form);

      if (erroValidacao) {
        mensagem = {
          tipo: 'erro',
          texto: erroValidacao,
        };

        main.querySelector('#cad-aviso').innerHTML = aviso(mensagem);
        return;
      }

      mensagem = null;
      enviando = true;

      const botao = main.querySelector('#btn-finalizar');
      botao.disabled = true;
      botao.innerHTML = spinner(true);

      try {
        await PV.db.pacientes.criar({
          email: form.email.trim(),
          senha: form.senha,
          nome: form.nome.trim(),
          nome_social: form.nome_social,
          celular: form.telefone,
        });

        PV.router.navegar(
          '/login?email=' +
          encodeURIComponent(form.email.trim()),
        );
      } catch (e) {
        mensagem = {
          tipo: 'erro',
          texto:
            e.message ||
            'Erro ao enviar. Tente novamente.',
        };

        main.querySelector('#cad-aviso').innerHTML = aviso(mensagem);
        botao.disabled = false;
        botao.innerHTML = `
      <span>Concluir cadastro</span>
      <span aria-hidden="true">→</span>
      `;
      } finally {
        enviando = false;
      }
    }

    montar();
  }

  PV.screens.login = login;
  PV.screens.cadastro = cadastro;
})();
