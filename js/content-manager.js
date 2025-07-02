(function(global){
  /**
   * Class responsible for loading and rendering article content.
   * @class
   * @param {Object} [options={}]
   * @param {string} [options.articleUrl='content/sample_articles.json'] - URL to fetch articles.
   * @param {Storage} [options.storage=window.localStorage] - Storage used for bookmarks.
   * @param {number} [options.timeout=8000] - Fetch timeout in milliseconds.
   */
  class ContentFetchError extends Error {
    constructor(msg, cause) {
      super(msg);
      this.name = 'ContentFetchError';
      this.cause = cause;
    }
  }

  class ContentManager {
    constructor(options = {}) {
      this.articleUrl = options.articleUrl || 'content/sample_articles.json';
      this.searchUrl = options.searchUrl || this.articleUrl;
      this.bookmarkUrl = options.bookmarkUrl;
      this.storage = options.storage || window.localStorage;
      this.timeout = options.timeout || 8000;
      this.articles = [];
      this.searchInput = null;
      this.categorySelect = null;
      this.list = null;
    }

    /**
     * Fetch JSON data with timeout handling.
     * @param {string} url - Resource URL.
     * @returns {Promise<any>} Parsed JSON data.
     * @throws {Error} ContentFetchError when the request fails.
     * @side effects Performs a network request.
     */
    async fetchJSON(url, options = {}) {
      const controller = new AbortController();
      const t = options.timeout || this.timeout;
      const timer = setTimeout(() => controller.abort(), t);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new ContentFetchError('Bad response', res.statusText);
        return await res.json();
      } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') {
          throw new ContentFetchError('Request timed out', err);
        }
        if (err instanceof ContentFetchError) throw err;
        throw new ContentFetchError('Failed to fetch content', err);
      }
    }

    /**
     * Load articles from the configured URL and render them.
     * @returns {Promise<void>}
     * @side effects Updates DOM elements and internal state.
     */
    async load() {
      try {
        this.setLoading(true);
        this.articles = await this.fetchJSON(this.articleUrl);
        this.setLoading(false);
        this.render(this.articles);
      } catch (e) {
        this.setLoading(false);
        this.setError('Failed to load content');
      }
    }

    /**
     * Attach DOM elements and event listeners.
     * @param {Object} opts - Selector options for inputs and list.
     * @param {string} opts.searchInput - Selector for search input.
     * @param {string} opts.categorySelect - Selector for category select.
     * @param {string} opts.list - Selector for article list container.
     * @returns {void}
     * @side effects Registers event listeners and triggers initial load.
     */
    attach(opts = {}) {
      this.searchInput = document.querySelector(opts.searchInput);
      this.categorySelect = document.querySelector(opts.categorySelect);
      this.list = document.querySelector(opts.list);
      this.searchInput && this.searchInput.addEventListener('input', () => this.update());
      this.categorySelect && this.categorySelect.addEventListener('change', () => this.update());
      this.load();
    }

    /**
     * Apply current filters and re-render the list.
     * @returns {void}
     * @side effects Updates the displayed article list.
     */
    update() {
      const term = this.searchInput ? this.searchInput.value : '';
      const cat = this.categorySelect ? this.categorySelect.value : 'all';
      const items = this.filter(term, cat);
      this.render(items);
    }

    /**
     * Filter loaded articles by term and category.
     * @param {string} [term=''] - Search term.
     * @param {string} [category='all'] - Category to filter by.
     * @returns {Array} Filtered article list.
     */
    filter(term = '', category = 'all') {
      const q = term.trim().toLowerCase();
      return this.articles.filter(a => {
        const title = (a.title || '').toLowerCase();
        const cat = (a.category || '').toLowerCase();
        const tMatch = !q || title.includes(q);
        const cMatch = category === 'all' || cat === category.toLowerCase();
        return tMatch && cMatch;
      });
    }

    /**
     * Build a map of categories and their counts.
     * @param {Array} [items=this.articles] - Articles list.
     * @returns {Object} Category map.
     */
    categorize(items = this.articles) {
      return items.reduce((map, a) => {
        const key = (a.category || 'uncategorized').toLowerCase();
        map[key] = (map[key] || 0) + 1;
        return map;
      }, {});
    }

    /**
     * Fetch search results from the configured endpoint.
     * @param {string} term - Search query.
     * @returns {Promise<Array>} Articles matching the term.
     */
    async search(term) {
      const q = encodeURIComponent(term.trim());
      if (!q) return [];
      const url = `${this.searchUrl}?q=${q}`;
      const data = await this.fetchJSON(url);
      return Array.isArray(data) ? data : [];
    }

    /**
     * Render the given items into the list container.
     * @param {Array} items - Articles to display.
     * @returns {void}
     * @side effects Modifies the DOM.
     */
    render(items) {
      if (!this.list) return;
      this.list.innerHTML = '';
      items.forEach(a => {
        const el = document.createElement('article');
        el.className = 'post';
        el.innerHTML = `<h3 class="post__title">${a.title}</h3>`+
                       `<p class="post__meta">Category: ${a.category || ''}</p>`+
                       `<p class="post__excerpt">${a.excerpt || a.summary || ''}</p>`;
        const bm = document.createElement('button');
        bm.className = 'post__bookmark';
        bm.type = 'button';
        bm.textContent = this.isBookmarked(a.id) ? '★' : '☆';
        bm.addEventListener('click', () => {
          this.toggleBookmark(a.id);
          bm.textContent = this.isBookmarked(a.id) ? '★' : '☆';
        });
        el.appendChild(bm);
        this.list.appendChild(el);
      });
    }

    /**
     * Toggle bookmark state for an article.
     * @param {string|number} id - Article identifier.
     * @returns {void}
     * @side effects Writes to storage.
     */
    async toggleBookmark(id) {
      const set = new Set(JSON.parse(this.storage.getItem('bookmarks') || '[]'));
      set.has(id) ? set.delete(id) : set.add(id);
      this.storage.setItem('bookmarks', JSON.stringify([...set]));
      if (!this.bookmarkUrl) return;
      try {
        await this.fetchJSON(this.bookmarkUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (_) {
        /* ignore remote bookmark errors */
      }
    }

    /**
     * Check if an article is bookmarked.
     * @param {string|number} id - Article identifier.
     * @returns {boolean} Whether the article is bookmarked.
     */
    isBookmarked(id) {
      return JSON.parse(this.storage.getItem('bookmarks') || '[]').includes(id);
    }

    /**
     * Persist reading progress for an article.
     * @param {string|number} id - Article identifier.
     * @param {number} val - Progress ratio from 0 to 1.
     * @returns {void}
     * @side effects Writes to storage.
     */
    saveProgress(id, val) {
      const prog = JSON.parse(this.storage.getItem('progress') || '{}');
      prog[id] = val;
      this.storage.setItem('progress', JSON.stringify(prog));
    }

    /**
     * Track scroll position and save progress for an article.
     * @param {string|number} id - Article identifier.
     * @returns {void}
     * @side effects Adds a scroll listener.
     */
    trackReading(id) {
      window.addEventListener('scroll', () => {
        const d = document.documentElement;
        const pct = d.scrollTop / (d.scrollHeight - d.clientHeight);
        this.saveProgress(id, pct);
      });
    }

    /**
     * Toggle the loading state class on the list element.
     * @param {boolean} on - Whether to show the loading state.
     * @returns {void}
     * @side effects Modifies the DOM.
     */
    setLoading(on) {
      this.list && this.list.classList.toggle('content--loading', on);
    }

    /**
     * Display an error message in the list container.
     * @param {string} msg - Message to display.
     * @returns {void}
     * @side effects Modifies the DOM.
     */
    setError(msg) {
      if (!this.list) return;
      this.list.textContent = msg;
      this.list.classList.add('content--error');
    }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { ContentManager, ContentFetchError };
  } else {
    global.ContentManager = ContentManager;
    global.ContentFetchError = ContentFetchError;
  }
})(this);
