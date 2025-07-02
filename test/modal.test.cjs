const { JSDOM } = require('jsdom');
const modalUtils = require('../assets/js/modal.cjs');

const html = '<button id="open">Open</button><div id="m" class="modal" aria-hidden="true" tabindex="-1"><button class="modal__close">x</button></div>';

let window, document;

beforeEach(() => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com' });
  window = dom.window;
  document = window.document;
  global.window = window;
  global.document = document;
});

test('initModal opens and closes modal', () => {
  modalUtils.initModal('#open', '#m');
  const open = document.getElementById('open');
  const modal = document.getElementById('m');
  open.click();
  expect(modal.classList.contains('modal--open')).toBe(true);
  modal.querySelector('.modal__close').click();
  expect(modal.classList.contains('modal--open')).toBe(false);
});
