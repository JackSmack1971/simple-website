(function(global){
  'use strict';

  function applyTheme(body, toggle, theme) {
    var dark = theme === 'dark';
    body.classList.toggle('site--dark', dark);
    if (toggle) toggle.textContent = dark ? '\u263E' : '\u2600';
    return dark;
  }

  function initTheme(doc, storage) {
    var toggle = doc.querySelector('.theme-toggle');
    if (!toggle) return;
    var body = doc.body;
    var saved = storage && storage.getItem('theme');
    if (saved) applyTheme(body, toggle, saved);
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
    navToggle.addEventListener('click', function(){
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav__menu--open');
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

  function init(win, doc, storage) {
    doc = doc || document;
    win = win || window;
    storage = storage || win.localStorage;
    initNavigation(doc);
    initTheme(doc, storage);
    initFadeIn(doc, win);
    initSmoothScroll(doc);
    initLoader(win, doc);
    if (win.filterUtils) {
      var utils = win.filterUtils;
      utils.setupSearch('#news-search', '.news-list');
      utils.setupSearch('#paper-search', '.paper-list');
      utils.setupCategoryFilter('#category-filter', '.paper-list');
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
