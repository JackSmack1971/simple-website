(function(global){
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

    attach(opts = {}) {
      this.searchInput = document.querySelector(opts.searchInput);
      this.categorySelect = document.querySelector(opts.categorySelect);
      this.list = document.querySelector(opts.list);
      this.searchInput && this.searchInput.addEventListener('input', () => this.update());
      this.categorySelect && this.categorySelect.addEventListener('change', () => this.update());
      this.load();
    }

    update() {
      const term = this.searchInput ? this.searchInput.value : '';
      const cat = this.categorySelect ? this.categorySelect.value : 'all';
      const items = this.filter(term, cat);
      this.render(items);
    }

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

    toggleBookmark(id) {
      const set = new Set(JSON.parse(this.storage.getItem('bookmarks') || '[]'));
      set.has(id) ? set.delete(id) : set.add(id);
      this.storage.setItem('bookmarks', JSON.stringify([...set]));
    }

    isBookmarked(id) {
      return JSON.parse(this.storage.getItem('bookmarks') || '[]').includes(id);
    }

    saveProgress(id, val) {
      const prog = JSON.parse(this.storage.getItem('progress') || '{}');
      prog[id] = val;
      this.storage.setItem('progress', JSON.stringify(prog));
    }

    trackReading(id) {
      window.addEventListener('scroll', () => {
        const d = document.documentElement;
        const pct = d.scrollTop / (d.scrollHeight - d.clientHeight);
        this.saveProgress(id, pct);
      });
    }

    setLoading(on) {
      this.list && this.list.classList.toggle('content--loading', on);
    }

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
