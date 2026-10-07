/**
 * Ponto de entrada — equivalente a frontend/App.tsx + index.ts.
 */
(function () {
  const THEME_KEY = 'palivida_theme';

  function iniciarTema() {
    PV.ui.sincronizarControleTema();
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-theme-toggle]');
      if (!button) return;

      const ativar = !document.documentElement.classList.contains('pv-dark-mode');
      document.documentElement.classList.toggle('pv-dark-mode', ativar);
      try {
        localStorage.setItem(THEME_KEY, ativar ? 'dark' : 'light');
      } catch (error) {
        console.error('A preferência de tema não pôde ser salva.', error);
      }
      PV.ui.sincronizarControleTema();
    });
  }

  function iniciar() {
    iniciarTema();
    PV.router.renderizar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
