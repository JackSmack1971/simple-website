const { JSDOM } = require('jsdom');

const { ContentManager, ContentFetchError } = require('../js/content-manager.js');

describe('ContentManager', () => {
  let window, document, cm;

  beforeEach(() => {
    const dom = new JSDOM('<input id="s"><select id="c"><option value="all">All</option></select><div class="list"></div>', { url: 'https://example.com' });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    cm = new ContentManager({ articleUrl: 'test.json', storage: window.localStorage });
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([
      { id: 1, title: 'AI News', category: 'NLP' },
      { id: 2, title: 'Vision Paper', category: 'Vision' }
    ]) }));
    cm.attach({ searchInput: '#s', categorySelect: '#c', list: '.list' });
  });

  test('load renders articles', async () => {
    await cm.load();
    expect(document.querySelectorAll('.post').length).toBe(2);
  });

  test('filter by search term', () => {
    cm.articles = [{ id: 1, title: 'hello', category: 'NLP' }];
    const res = cm.filter('hell', 'all');
    expect(res.length).toBe(1);
  });

  test('bookmark toggles state', () => {
    cm.toggleBookmark(5);
    expect(cm.isBookmarked(5)).toBe(true);
    cm.toggleBookmark(5);
    expect(cm.isBookmarked(5)).toBe(false);
  });

  test('filter by category', () => {
    cm.articles = [
      { id: 1, title: 'a', category: 'NLP' },
      { id: 2, title: 'b', category: 'Vision' }
    ];
    const res = cm.filter('', 'NLP');
    expect(res.length).toBe(1);
    expect(res[0].category).toBe('NLP');
  });

  test('trackReading saves progress', () => {
    cm.saveProgress = jest.fn();
    cm.trackReading('123');
    window.dispatchEvent(new window.Event('scroll'));
    expect(cm.saveProgress).toHaveBeenCalled();
  });

  test('loading and error states modify DOM', () => {
    const list = document.querySelector('.list');
    cm.setLoading(true);
    expect(list.classList.contains('content--loading')).toBe(true);
    cm.setLoading(false);
    cm.setError('err');
    expect(list.textContent).toBe('err');
    expect(list.classList.contains('content--error')).toBe(true);
  });

  test('categorize groups articles', () => {
    cm.articles = [
      { id: 1, category: 'NLP' },
      { id: 2, category: 'Vision' },
      { id: 3, category: 'NLP' }
    ];
    const map = cm.categorize();
    expect(map.nlp).toBe(2);
    expect(map.vision).toBe(1);
  });

  test('search fetches remote data', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([{ id: 9 }]) }));
    const res = await cm.search('ai');
    expect(res.length).toBe(1);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('fetchJSON throws ContentFetchError on timeout', async () => {
    global.fetch = () => new Promise((_, r) => setTimeout(() => r(new Error('fail')), 10));
    await expect(cm.fetchJSON('url', { timeout: 5 })).rejects.toBeInstanceOf(ContentFetchError);
  });

  test('toggleBookmark posts to server when url provided', async () => {
    cm.bookmarkUrl = '/bm';
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
    await cm.toggleBookmark(1);
    expect(global.fetch).toHaveBeenCalled();
  });
});
