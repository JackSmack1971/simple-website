(function(global){
  'use strict';

  /**
   * Apply a light or dark theme to the document body.
   * @param {HTMLElement} body - The document body element.
   * @param {HTMLElement} [toggle] - Optional toggle element to update text.
   * @param {string} theme - 'light' or 'dark'.
   * @returns {boolean} True if dark theme is applied.
   * @side effects Updates the DOM classes and toggle text.
   */
  function applyTheme(body, toggle, theme) {
    var dark = theme === 'dark';
    body.classList.toggle('site--dark', dark);
    if (toggle) {
      toggle.textContent = dark ? '\u263E' : '\u2600';
      toggle.setAttribute('aria-pressed', String(dark));
    }
    return dark;
  }

  function initTheme(doc, storage, win) {
    var toggle = doc.querySelector('.theme-toggle');
    if (!toggle) return;
    var body = doc.body;
    var saved = storage && storage.getItem('theme');
    var system = win.matchMedia('(prefers-color-scheme: dark)');
    if (saved) {
      applyTheme(body, toggle, saved);
    } else if (system.matches) {
      applyTheme(body, toggle, 'dark');
    }
    system.addEventListener('change', function(e){
      if (!storage.getItem('theme')) {
        applyTheme(body, toggle, e.matches ? 'dark' : 'light');
      }
    });
    toggle.addEventListener('click', function(){
      var newTheme = body.classList.contains('site--dark') ? 'light' : 'dark';
      applyTheme(body, toggle, newTheme);
      storage && storage.setItem('theme', newTheme);
    });
  }

  function initNavigation(doc) {
    var navToggle = doc.querySelector('.nav__toggle');
    var navMenu = doc.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;
    var firstLink = navMenu.querySelector('a');
    navMenu.setAttribute('aria-hidden', 'true');

    function trap(e) {
      if (e.key === 'Escape') navToggle.click();
    }

    navToggle.addEventListener('click', function(){
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav__menu--open');
      navMenu.setAttribute('aria-hidden', String(expanded));
      if (!expanded) {
        firstLink && firstLink.focus();
        navMenu.addEventListener('keydown', trap);
      } else {
        navMenu.removeEventListener('keydown', trap);
        navToggle.focus();
      }
    });
  }

  function initFadeIn(doc, win) {
    var fadeElements = doc.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in win) {
      var observer = new win.IntersectionObserver(function(entries, obs){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      fadeElements.forEach(function(el){ observer.observe(el); });
    } else {
      fadeElements.forEach(function(el){ el.classList.add('is-visible'); });
    }
  }

  function initSmoothScroll(doc) {
    doc.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click', function(e){
        var target = doc.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initLoader(win, doc) {
    var loader = doc.querySelector('.loader');
    if (!loader) return;
    win.addEventListener('load', function(){
      loader.classList.add('loader--hidden');
    });
  }

  function registerServiceWorker(win) {
    if (!('serviceWorker' in win.navigator)) return;
    win.addEventListener('load', function(){
      win.navigator.serviceWorker.register('/sw.js').catch(function(){});
    });
  }

  /**
   * Show install promotion when available.
   * @param {Window} win - Window context.
   * @param {Document} doc - Document context.
   * @returns {void}
   */
  function initInstallPrompt(win, doc) {
    var container = doc.querySelector('.install-promo');
    if (!container) return;
    var button = container.querySelector('.install-promo__button');
    var deferred;
    win.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault();
      deferred = e;
      container.hidden = false;
    });
    button && button.addEventListener('click', async function(){
      if (!deferred) return;
      container.hidden = true;
      deferred.prompt();
      try { await deferred.userChoice; } finally { deferred = null; }
    });
  }

  /**
   * Initialize all site scripts.
   * @param {Window} [win=window] - Window context.
   * @param {Document} [doc=document] - Document context.
   * @param {Storage} [storage=win.localStorage] - Storage for user preferences.
   * @returns {void}
   * @side effects Attaches multiple event listeners and updates DOM elements.
   */
  function init(win, doc, storage) {
    doc = doc || document;
    win = win || window;
    storage = storage || win.localStorage;
    initNavigation(doc);
    initTheme(doc, storage, win);
    initFadeIn(doc, win);
    initSmoothScroll(doc);
    initLoader(win, doc);
    registerServiceWorker(win);
    initInstallPrompt(win, doc);
    if (win.filterUtils) {
      var utils = win.filterUtils;
      utils.setupSearch('#news-search', '.news-list');
      utils.setupSearch('#paper-search', '.paper-list');
      utils.setupCategoryFilter('#category-filter', '.paper-list');
      utils.setupButtonFilter('.filter-button', '.research-preview__grid');
    }
    if (win.autocompleteUtils) {
      win.autocompleteUtils.init('#hero-search', '#hero-suggestions');
    }
    if (win.formUtils) {
      win.formUtils.initNewsletterForm('.newsletter__form');
    }
    if (win.modalUtils) {
      win.modalUtils.initModal(null, '#subscribe-modal');
    }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { init: init, applyTheme: applyTheme };
  } else {
    global.mainUtils = { init: init };
    if (document.readyState !== 'loading') {
      init(global, document);
    } else {
      document.addEventListener('DOMContentLoaded', function(){ init(global, document); });
    }
  }
})(this);
