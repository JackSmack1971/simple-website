(function(global){
  /**
   * Class responsible for loading and rendering article content.
   * @class
   * @param {Object} [options={}]
   * @param {string} [options.articleUrl='content/sample_articles.json'] - URL to fetch articles.
   * @param {Storage} [options.storage=window.localStorage] - Storage used for bookmarks.
   * @param {number} [options.timeout=8000] - Fetch timeout in milliseconds.
   */
  class ContentManager {
    constructor(options = {}) {
      this.articleUrl = options.articleUrl || 'content/sample_articles.json';
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
    async fetchJSON(url) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error('BadResponse');
        return await res.json();
      } catch (e) {
        clearTimeout(timer);
        throw new Error('ContentFetchError');
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
    toggleBookmark(id) {
      const set = new Set(JSON.parse(this.storage.getItem('bookmarks') || '[]'));
      set.has(id) ? set.delete(id) : set.add(id);
      this.storage.setItem('bookmarks', JSON.stringify([...set]));
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
    module.exports = ContentManager;
  } else {
    global.ContentManager = ContentManager;
  }
})(this);
