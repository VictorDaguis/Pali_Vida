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
        <div class="pv-login-page">

          <div class="pv-login-bg-shape pv-login-bg-shape-1"></div>
          <div class="pv-login-bg-shape pv-login-bg-shape-2"></div>
          <div class="pv-login-art" aria-hidden="true">
            <div class="pv-login-art-orbit pv-login-art-orbit--large"></div>
            <div class="pv-login-art-orbit pv-login-art-orbit--small"></div>
            <div class="pv-login-art-mark">+</div>
            <div class="pv-login-art-card">
              <span class="pv-login-art-card-icon">+</span>
              <span><strong>Cuidado contínuo</strong><small>Um passo de cada vez.</small></span>
              <span class="pv-login-art-card-dot"></span>
            </div>
          </div>

          <div class="pv-login-layout">

            <!-- ================================================= Desktop / tablet -->
            <section class="pv-login-brand-panel">
              <img
                class="pv-login-brand-logo"
                src="assets/img/logo-completo.png"
                alt="PaliVida"
              >

              <span class="pv-login-tagline">
                CUIDADO&nbsp;&nbsp;•&nbsp;&nbsp;CONFORTO&nbsp;&nbsp;•&nbsp;&nbsp;SEMPRE
              </span>

              <h1>Você não está<br>sozinho.</h1>

              <p>
                O PaliVida está aqui para apoiar você e sua família
                em cada etapa da sua jornada.
              </p>

            </section>

            <!-- ================================================= Login -->
            <section class="pv-login-card-wrap">
              <div class="pv-login-card">

                <div class="pv-login-card-brand">
                  <img src="assets/img/logo-completo.png" alt="PaliVida">
                  <span class="pv-login-tagline">
                    CUIDADO&nbsp;&nbsp;•&nbsp;&nbsp;CONFORTO&nbsp;&nbsp;•&nbsp;&nbsp;SEMPRE
                  </span>
                </div>

                <div class="pv-login-status" aria-hidden="true">
                  <span>9:41</span>
                  <span class="pv-login-status-icons">
                    <svg viewBox="0 0 48 18">
                      <path d="M2 15V11m5 4V8m5 7V5" />
                      <path d="M17 7c4-4 9-4 13 0m-10 3c2-2 5-2 7 0m-4 4h.1" />
                      <rect x="36" y="3" width="10" height="12" rx="2" />
                      <path d="M47 7v4" />
                    </svg>
                  </span>
                </div>

                <div class="pv-login-mobile-brand">
                  <img
                    src="assets/img/logo-completo.png"
                    alt="PaliVida"
                  >

                  <span class="pv-login-tagline">
                    CUIDADO&nbsp;&nbsp;•&nbsp;&nbsp;CONFORTO&nbsp;&nbsp;•&nbsp;&nbsp;SEMPRE
                  </span>
                </div>

                <span class="pv-login-eyebrow pv-login-desktop-eyebrow">BEM-VINDO DE VOLTA</span>

                <h2 class="pv-login-desktop-heading">Entrar</h2>
                <h2 class="pv-login-mobile-heading">Bem-vindo(a)!</h2>

                <p class="pv-login-intro pv-login-desktop-intro">
                  Acesse sua conta para continuar no PaliVida.
                </p>
                <p class="pv-login-intro pv-login-mobile-intro">
                  Faça seu login para continuar<br class="pv-login-mobile-break"> no PaliVida.
                </p>

                <div class="pv-login-form">

                  <label for="login-email">E-mail</label>

                  <div class="pv-login-input-wrap">
                    <span class="pv-login-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                        <path d="m5.5 7 6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>

                    <input
                      class="pv-login-input"
                      id="login-email"
                      type="email"
                      placeholder="Digite o seu e-mail"
                      autocomplete="email"
                      value="${escaparHtml(ctx.query.email || '')}"
                    >
                  </div>

                  <label for="login-senha">Senha</label>

                  <div class="pv-login-input-wrap">
                    <span class="pv-login-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M8 10V7.5A4 4 0 0 1 12 3.5a4 4 0 0 1 4 4V10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </span>

                    <input
                      class="pv-login-input pv-login-password-input"
                      id="login-senha"
                      type="password"
                      placeholder="Digite a sua senha"
                      autocomplete="current-password"
                    >

                    <button
                      class="pv-login-eye"
                      id="login-toggle-password"
                      type="button"
                      aria-label="Mostrar senha"
                      aria-pressed="false"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
                      </svg>
                    </button>
                  </div>

                  <button
                    class="pv-login-forgot"
                    id="link-esqueci"
                    type="button"
                  >
                    Esqueceu sua senha?
                  </button>

                  <div
                    class="pv-login-message"
                    id="login-aviso"
                    aria-live="polite"
                  ></div>

                  <button
                    class="pv-login-primary"
                    id="btn-entrar"
                    type="button"
                  >
                    <span>Entrar</span>
                    <span class="pv-login-arrow" aria-hidden="true">→</span>
                  </button>

                  <div class="pv-login-divider">
                    <span></span>
                    <b>ou</b>
                    <span></span>
                  </div>

                  <button
                    class="pv-login-register"
                    id="link-cadastro"
                    type="button"
                  >
                    <span class="pv-login-register-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M6.5 17.5 4 20v-4.5A7.5 7.5 0 1 1 11.5 23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 10h5M16.5 7.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </span>
                    <span>Cadastrar-se</span>
                  </button>

                  <div class="pv-login-secure">
                    <span class="pv-login-secure-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="m8.5 12 2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>

                    <div>
                      <strong>Acesso seguro</strong>
                      <span>Seus dados estão protegidos.</span>
                    </div>

                    <span class="pv-login-secure-lock" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect x="6.5" y="10" width="11" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M9 10V7.5a3 3 0 0 1 6 0V10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </div>

                  <details class="pv-login-demo">
                    <summary>Entrar com uma conta de demonstração</summary>
                    <p>Escolha um perfil para acessar o sistema:</p>
                    <div class="pv-login-demo-actions">
                      <button type="button" data-demo-account="paciente">Paciente</button>
                      <button type="button" data-demo-account="administrador">Administrador</button>
                      <button type="button" data-demo-account="acompanhante">Cuidador</button>
                    </div>
                    <small>Senha para as três contas: <code>palivida123</code></small>
                  </details>

                </div>
              </div>
            </section>

          </div>
        </div>
      `;
    }

    function templateRecuperar() {
      return `
        <div class="pv-login-page">
          <div class="pv-login-bg-shape pv-login-bg-shape-1"></div>
          <div class="pv-login-bg-shape pv-login-bg-shape-2"></div>

          <div class="pv-login-recovery-wrap">
            <div class="pv-login-recovery-card">

              <div class="pv-login-recovery-brand">
                <img src="assets/img/logo-completo.png" alt="PaliVida">
                <span class="pv-login-tagline">
                  CUIDADO&nbsp;&nbsp;•&nbsp;&nbsp;CONFORTO&nbsp;&nbsp;•&nbsp;&nbsp;SEMPRE
                </span>
              </div>

              <span class="pv-login-eyebrow">RECUPERAÇÃO DE ACESSO</span>
              <h2>Recuperar senha</h2>

              <p class="pv-login-intro">
                Informe o e-mail cadastrado e enviaremos as instruções para redefinir a sua senha.
              </p>

              <label for="rec-email">E-mail</label>

              <div class="pv-login-input-wrap">
                <span class="pv-login-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                    <path d="m5.5 7 6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>

                <input
                  class="pv-login-input"
                  id="rec-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autocomplete="email"
                >
              </div>

              <div class="pv-login-message" id="rec-aviso" aria-live="polite"></div>

              <button class="pv-login-primary" id="rec-enviar" type="button">
                <span>Enviar instruções</span>
                <span class="pv-login-arrow" aria-hidden="true">→</span>
              </button>

              <button class="pv-login-back" id="rec-voltar" type="button">
                ← Voltar ao login
              </button>

              <div class="pv-login-secure pv-login-secure-recovery">
                <span class="pv-login-secure-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3.5 20 6v5.5c0 4.6-3.1 7.8-8 9-4.9-1.2-8-4.4-8-9V6l8-2.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="m8.5 12 2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <div>
                  <strong>Privacidade e segurança</strong>
                  <span>Seu acesso é tratado de forma protegida.</span>
                </div>
              </div>

            </div>
          </div>
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
        ${headerLogin()}
        <div class="tela-auth tela-cadastro">
          <h1 class="titulo">Cadastre-se</h1>
          <p class="subtitulo" style="max-width:340px;margin-left:auto;margin-right:auto;font-style:italic;font-weight:400">
            Os demais dados (saúde, contatos, equipe de cuidado) você preenche depois, com calma, no Prontuário Eletrônico.
          </p>
          <button class="botao-enviar" id="btn-iniciar" type="button" style="width:85%;max-width:480px">
            Iniciar meu cadastro
          </button>
          <button class="botao-voltar" id="btn-voltar-login" type="button" style="width:85%;max-width:480px">
            Voltar ao Login
          </button>
        </div>`;
    }

    function campoTexto(label, campo, opts = {}) {
      const {
        placeholder = '',
        tipo: tipoInput = 'text',
        maxlength = '',
      } = opts;

      return `
        <label class="campo-label" for="c-${campo}">
          ${label}
        </label>

        <input
          class="campo"
          id="c-${campo}"
          type="${tipoInput}"
          placeholder="${escaparHtml(placeholder)}"
          ${maxlength ? `maxlength="${maxlength}"` : ''}
          value="${escaparHtml(form[campo])}"
        >`;
    }

    function telaEtapa2() {
      return `
        ${headerLogin()}
        <div class="tela-auth tela-cadastro">
          <h1 class="titulo">Criar acesso</h1>

          <div class="form">
            ${campoTexto('Nome completo *', 'nome', { placeholder: 'Seu nome' })}
            ${campoTexto('Nome social', 'nome_social', { placeholder: 'Nome social (opcional)' })}
            ${campoTexto('Telefone *', 'telefone', { placeholder: '(00) 00000-0000', maxlength: 15 })}
            ${campoTexto('E-mail *', 'email', { placeholder: 'seuemail@exemplo.com', tipo: 'email' })}
            ${campoTexto('Senha *', 'senha', { placeholder: 'Crie uma senha', tipo: 'password' })}
            ${campoTexto('Confirmar senha *', 'confirmarSenha', { placeholder: 'Repita a senha', tipo: 'password' })}

            <p class="obrigatorio">* Campo obrigatório</p>
            <div id="cad-aviso">
              ${mensagem ? aviso(mensagem) : ''}
            </div>
          </div>

          <button class="botao-enviar" id="btn-finalizar" type="button">
            Finalizar cadastro
          </button>

          <button class="botao-voltar" id="btn-voltar-etapa" type="button">
            Voltar
          </button>
        </div>`;
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

        main
          .querySelector('#btn-iniciar')
          .addEventListener('click', () => {
            etapa = 2;
            montar();
          });

        main
          .querySelector('#btn-voltar-login')
          .addEventListener('click', () => {
            PV.router.navegar('/login');
          });

        return;
      }

      main.innerHTML = telaEtapa2();
      ligarCamposTexto();

      main
        .querySelector('#btn-voltar-etapa')
        .addEventListener('click', () => {
          etapa = 1;
          montar();
        });

      main
        .querySelector('#btn-finalizar')
        .addEventListener('click', enviar);
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
        botao.textContent = 'Finalizar cadastro';
      } finally {
        enviando = false;
      }
    }

    montar();
  }

  PV.screens.login = login;
  PV.screens.cadastro = cadastro;
})();
