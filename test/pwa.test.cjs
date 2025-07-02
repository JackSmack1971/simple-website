const { JSDOM } = require('jsdom');
const fs = require('fs');
const mainUtils = require('../assets/js/main.js');

const pages = [
  'index.html',
  'pages/about.html',
  'pages/article.html',
  'pages/contact.html',
  'pages/news.html',
  'pages/paper.html',
  'pages/research.html'
];

test('all pages include manifest link', () => {
  pages.forEach(p => {
    const html = fs.readFileSync(p, 'utf8');
    const dom = new JSDOM(html);
    const link = dom.window.document.querySelector('link[rel="manifest"]');
    expect(link).not.toBeNull();
  });
});

test('service worker registers when supported', async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com' });
  const win = dom.window;
  win.navigator.serviceWorker = { register: jest.fn(() => Promise.resolve()) };
  win.matchMedia = () => ({ matches: false, addEventListener: () => {} });
  mainUtils.init(win, win.document, win.localStorage);
  await Promise.resolve();
  expect(win.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
});
