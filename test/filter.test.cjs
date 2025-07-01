const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');
const fs = require('fs');
const filterUtils = require('../assets/js/filter.cjs');

const html = fs.readFileSync('pages/research.html', 'utf8');

let window, document;

beforeEach(() => {
  const dom = new JSDOM(html, { runScripts: "outside-only" });
  window = dom.window;
  document = dom.window.document;
  global.window = window;
  global.document = document;
});

test('setupSearch filters posts', () => {
  filterUtils.setupSearch('#paper-search', '.paper-list');
  const input = document.querySelector('#paper-search');
  const posts = document.querySelectorAll('.paper-list .post');
  input.value = 'Diffusion';
  input.dispatchEvent(new window.Event('input'));
  expect(posts[0].style.display).toBe('');
  expect(posts[1].style.display).toBe('none');
});

test('setupCategoryFilter filters categories', () => {
  filterUtils.setupCategoryFilter('#category-filter', '.paper-list');
  const select = document.querySelector('#category-filter');
  const posts = document.querySelectorAll('.paper-list .post');
  select.value = 'NLP';
  select.dispatchEvent(new window.Event('change'));
  expect(posts[0].style.display).toBe('none');
  expect(posts[1].style.display).toBe('');
});

test('setupButtonFilter filters by topic', () => {
  document.body.innerHTML = '<div class="research-preview__grid">' +
    '<article class="post" data-topic="Vision"><p class="post__meta">Category: Vision</p></article>' +
    '<article class="post" data-topic="NLP"><p class="post__meta">Category: NLP</p></article>' +
    '</div>' +
    '<button class="filter-button" data-topic="Vision"></button>' +
    '<button class="filter-button" data-topic="all"></button>';
  filterUtils.setupButtonFilter('.filter-button', '.research-preview__grid');
  const buttons = document.querySelectorAll('.filter-button');
  const posts = document.querySelectorAll('.post');
  buttons[0].click();
  expect(posts[0].style.display).toBe('');
  expect(posts[1].style.display).toBe('none');
  buttons[1].click();
  expect(posts[0].style.display).toBe('');
  expect(posts[1].style.display).toBe('');
});
