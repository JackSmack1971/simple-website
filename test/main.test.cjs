const { JSDOM } = require('jsdom');
const fs = require('fs');
const mainUtils = require('../assets/js/main.js');

const html = fs.readFileSync('index.html', 'utf8');

let window, document, localStorage;

beforeEach(() => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com' });
  window = dom.window;
  document = window.document;
  localStorage = window.localStorage;
});

test('applyTheme sets dark mode', () => {
  const toggle = document.querySelector('.theme-toggle');
  mainUtils.applyTheme(document.body, toggle, 'dark');
  expect(document.body.classList.contains('site--dark')).toBe(true);
  expect(toggle.textContent).toBe('\u263E');
});

test('init uses stored theme', () => {
  localStorage.setItem('theme', 'dark');
  mainUtils.init(window, document, localStorage);
  expect(document.body.classList.contains('site--dark')).toBe(true);
});

test('navigation toggle opens menu', () => {
  mainUtils.init(window, document, localStorage);
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  navToggle.click();
  expect(navMenu.classList.contains('nav__menu--open')).toBe(true);
});

test('loader hides on window load', () => {
  mainUtils.init(window, document, localStorage);
  const loader = document.querySelector('.loader');
  window.dispatchEvent(new window.Event('load'));
  expect(loader.classList.contains('loader--hidden')).toBe(true);
});

test('fade-in observer reveals elements', () => {
  const fade = document.querySelector('.fade-in');
  window.IntersectionObserver = function(cb){
    this.observe = function(el){ cb([{ isIntersecting: true, target: el }], this); };
    this.unobserve = function(){};
  };
  mainUtils.init(window, document, localStorage);
  expect(fade.classList.contains('is-visible')).toBe(true);
});

test('smooth scroll links scroll to target', () => {
  document.body.innerHTML += '<a href="#anchor" id="link">Link</a><div id="anchor"></div>';
  const target = document.getElementById("anchor");
  target.scrollIntoView = function(){};
  const spy = jest.spyOn(target, "scrollIntoView");
  mainUtils.init(window, document, localStorage);
  document.getElementById('link').click();
  expect(spy).toHaveBeenCalled();
});

test('filter utilities are invoked', () => {
  window.filterUtils = {
    setupSearch: jest.fn(),
    setupCategoryFilter: jest.fn(),
    setupButtonFilter: jest.fn()
  };
  mainUtils.init(window, document, localStorage);
  expect(window.filterUtils.setupSearch).toHaveBeenCalled();
  expect(window.filterUtils.setupCategoryFilter).toHaveBeenCalled();
  expect(window.filterUtils.setupButtonFilter).toHaveBeenCalled();
});
