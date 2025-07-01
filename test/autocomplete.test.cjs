const { JSDOM } = require('jsdom');
const fs = require('fs');
const autocomplete = require('../js/autocomplete.cjs');

const html = fs.readFileSync('index.html', 'utf8');

let window, document;

beforeEach(() => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com' });
  window = dom.window;
  document = window.document;
  global.window = window;
  global.document = document;
});

test('init displays suggestions', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ title: 'AI Advances' }])
  }));
  autocomplete.init('#hero-search', '#hero-suggestions');
  await new Promise(r => setImmediate(r));
  const input = document.querySelector('#hero-search');
  input.value = 'AI';
  input.dispatchEvent(new window.Event('input'));
  await new Promise(r => setImmediate(r));
  const suggestion = document.querySelector('.hero__suggestion');
  expect(suggestion).not.toBeNull();
  expect(suggestion.textContent).toBe('AI Advances');
});

test('fetchSuggestions throws on network failure', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
  await expect(autocomplete.fetchSuggestions('url')).rejects.toThrow('SuggestionFetchError');
});

test('init sets aria-live on list', () => {
  autocomplete.init('#hero-search', '#hero-suggestions');
  const list = document.querySelector('#hero-suggestions');
  expect(list.getAttribute('aria-live')).toBe('polite');
});

test('suggestions have role option', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ title: 'GPT' }])
  }));
  autocomplete.init('#hero-search', '#hero-suggestions');
  await new Promise(r => setImmediate(r));
  const input = document.querySelector('#hero-search');
  input.value = 'g';
  input.dispatchEvent(new window.Event('input'));
  await new Promise(r => setImmediate(r));
  const li = document.querySelector('.hero__suggestion');
  expect(li.getAttribute('role')).toBe('option');
});

test('arrow keys navigate suggestions', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ title: 'one' }, { title: 'two' }])
  }));
  autocomplete.init('#hero-search', '#hero-suggestions');
  await new Promise(r => setImmediate(r));
  const input = document.querySelector('#hero-search');
  input.value = 'o';
  input.dispatchEvent(new window.Event('input'));
  await new Promise(r => setImmediate(r));
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  let items = document.querySelectorAll('.hero__suggestion');
  expect(items[0].getAttribute('aria-selected')).toBe('true');
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  items = document.querySelectorAll('.hero__suggestion');
  expect(items[1].getAttribute('aria-selected')).toBe('true');
});
