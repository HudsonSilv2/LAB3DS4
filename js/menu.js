/**
 * @file menu.js
 * @description Implementação em JavaScript do componente Sliding Menu.
 * Fornece métodos de controle de estado e suporte a navegação por teclado.
 * @author Hudson
 * @version 1.0.0
 */

/**
 * Classe responsável por gerenciar o estado e comportamento do Menu Deslizante.
 */
class SlidingMenu {
  /**
   * Inicializa o componente SlidingMenu e configura referências aos elementos do DOM.
   * @param {Object} [options={}] - Configurações opcionais de inicialização.
   * @param {string} [options.menuSelector='#sliding-menu'] - Seletor CSS do elemento do menu.
   * @param {string} [options.toggleSelector='#menu-toggle-btn'] - Seletor CSS do botão de alternância.
   * @param {string} [options.closeSelector='#menu-close-btn'] - Seletor CSS do botão de fechamento.
   * @param {string} [options.overlaySelector='#menu-overlay'] - Seletor CSS do overlay de fundo.
   */
  constructor(options = {}) {
    this.menu = document.querySelector(options.menuSelector || '#sliding-menu');
    this.toggleBtn = document.querySelector(options.toggleSelector || '#menu-toggle-btn');
    this.closeBtn = document.querySelector(options.closeSelector || '#menu-close-btn');
    this.overlay = document.querySelector(options.overlaySelector || '#menu-overlay');

    /** @type {boolean} Estado atual de visibilidade do menu */
    this.isOpen = false;

    /** @type {HTMLElement|null} Elemento focado antes da abertura para restauração */
    this.lastFocusedElement = null;

    // Vincula o contexto dos métodos
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  /**
   * Configura os ouvintes de eventos necessários para interação com o menu.
   * @returns {void}
   */
  init() {
    if (!this.menu) {
      console.warn('[SlidingMenu] Elemento do menu não encontrado no DOM.');
      return;
    }

    // EVENTO: escutar clique no botao de toggle principal
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', this.toggleMenu);
    }

    // EVENTO: escutar clique no botao de fechar
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.closeMenu);
    }

    // EVENTO: escutar clique no overlay (fechar ao clicar fora)
    if (this.overlay) {
      this.overlay.addEventListener('click', this.closeMenu);
    }

    // EVENTO: escutar clique no botao com o atributo de ação cta-open-menu
    const ctaButton = document.querySelector('#cta-open-menu');
    if (ctaButton) {
      ctaButton.addEventListener('click', this.openMenu);
    }

    // EVENTO: escutar clique nos links dentro do menu
    const links = this.menu.querySelectorAll('a.menu-link');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // EVENTO: escutar tecla ESC
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Abre o menu deslizante, ativando animações e atualizando estados de acessibilidade.
   * @returns {void}
   */
  openMenu() {
    if (this.isOpen) return;

    this.lastFocusedElement = document.activeElement;
    this.isOpen = true;

    // ADICIONA CLASSES VISUAIS
    this.menu.classList.add('is-open');
    if (this.overlay) {
      this.overlay.classList.add('is-visible');
      this.overlay.setAttribute('aria-hidden', 'false');
    }

    // Atualiza atributos de acessibilidade (ARIA)
    this.menu.setAttribute('aria-hidden', 'false');
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-expanded', 'true');
    }

    // Move o foco para o botão de fechar para permitir navegação imediata por teclado
    if (this.closeBtn) {
      setTimeout(() => {
        this.closeBtn.focus();
      }, 50);
    }

    // Evita rolagem da página quando o menu estiver aberto(opicional)
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha o menu deslizante, ocultando overlay e restaurando atributos e foco.
   * @returns {void}
   */
  closeMenu() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // REMOVE CLASSES VISUAIS
    this.menu.classList.remove('is-open');
    if (this.overlay) {
      this.overlay.classList.remove('is-visible');
      this.overlay.setAttribute('aria-hidden', 'true');
    }

    // Atualiza atributos de acessibilidade (ARIA)
    this.menu.setAttribute('aria-hidden', 'true');
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-expanded', 'false');
    }

    // Restaura o foco para o elemento original que acionou a abertura
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }

    // Restaura a rolagem do corpo da página
    document.body.style.overflow = '';
  }

  /**
   * Alterna entre os estados aberto e fechado do menu.
   * @returns {void}
   */
  toggleMenu() { //Estados aberta ou fechada do Menu
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Trata eventos de teclado, permitindo fechar o menu através da tecla Escape.
   * @param {KeyboardEvent} event - O evento de teclado disparado pelo navegador.
   * @returns {void}
   */
  handleKeydown(event) {
    // Se apertar ESC fecha o menu
    if (event.key === 'Escape' || event.key === 'Esc') {
      if (this.isOpen) {
        event.preventDefault();
        this.closeMenu();
      }
    }
  }
}

// Inicialização automática ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  window.slidingMenuInstance = new SlidingMenu();
  if (window.location.hash === '#open') {
    window.slidingMenuInstance.openMenu();
  }
});

// Exporta globalmente para uso como módulo ou script tradicional
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SlidingMenu;
}
