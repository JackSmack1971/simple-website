const { JSDOM } = require('jsdom');
const formUtils = require('../assets/js/forms.cjs');

const html = `<form class="newsletter__form" action="/api" method="post">
  <input type="email" id="email" />
  <button type="submit">Send</button>
</form>
<div id="subscribe-modal" class="modal" aria-hidden="true" tabindex="-1"><button class="modal__close">x</button></div>`;

let window, document;

beforeEach(() => {
  const dom = new JSDOM(html, { runScripts:'outside-only', url:'https://example.com' });
  window = dom.window;
  document = window.document;
  global.window = window;
  global.document = document;
});

test('invalid email prevents submit', async () => {
  formUtils.initNewsletterForm('.newsletter__form');
  const form = document.querySelector('.newsletter__form');
  const email = form.querySelector('input');
  email.value = 'bad';
  global.fetch = jest.fn();
  globalThis.fetch = global.fetch;
  const handler = jest.fn();
  form.addEventListener('formerror', handler);
  form.dispatchEvent(new window.Event('submit'));
  expect(handler).toHaveBeenCalled();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('valid email opens modal', async () => {
  global.modalUtils = { openModal: jest.fn() };
  formUtils.initNewsletterForm('.newsletter__form');
  const form = document.querySelector('.newsletter__form');
  const email = form.querySelector('input');
  email.value = 'a@b.com';
  global.fetch = jest.fn(() => Promise.resolve({ ok:true, json: () => Promise.resolve({}) }));
  globalThis.fetch = global.fetch;
  const handler = jest.fn();
  form.addEventListener('formerror', handler);
  form.dispatchEvent(new window.Event('submit'));
  await new Promise(r => setTimeout(r, 0));
  expect(handler).toHaveBeenCalled();
});
