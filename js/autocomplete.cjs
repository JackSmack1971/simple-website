(function(global){
  /**
   * Fetch a list of suggestion objects from a URL.
   * @param {string} url - The endpoint containing JSON suggestions.
   * @returns {Promise<Array>} Resolves with an array of suggestions.
   * @throws {Error} SuggestionFetchError if the request fails.
   * @side effects Initiates a network request and uses a timeout.
  */
  async function fetchSuggestions(url){
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error('BadResponse');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      clearTimeout(timer);
      throw new Error('SuggestionFetchError');
    }
  }

  /**
   * Render suggestion list items.
   * @param {HTMLElement} list
   * @param {Array} suggestions
   * @param {string} q
   * @returns {number} New active index
   */
  function renderList(list, suggestions, q){
    list.innerHTML = '';
    if (!q || q.length > 50) return -1;
    suggestions.filter(a => a.title.toLowerCase().includes(q))
      .slice(0,5).forEach(item => {
        const li = document.createElement('li');
        li.className = 'hero__suggestion';
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '-1');
        li.textContent = item.title;
        list.appendChild(li);
      });
    return -1;
  }

  /**
   * Handle arrow key navigation.
   * @param {KeyboardEvent} e
   * @param {HTMLElement} list
   * @param {number} active
   * @returns {number} Updated active index
   */
  function handleKeyNav(e, list, active){
    const items = list.querySelectorAll('.hero__suggestion');
    if (!items.length || !['ArrowDown','ArrowUp'].includes(e.key)) return active;
    e.preventDefault();
    active = e.key === 'ArrowDown' ? (active + 1) % items.length
                                   : (active - 1 + items.length) % items.length;
    items.forEach((li, i) => {
      const on = i === active;
      li.classList.toggle('hero__suggestion--active', on);
      li.setAttribute('aria-selected', on);
      if (on) li.focus();
    });
    return active;
  }

  /**
   * Initialize the autocomplete input behavior.
   * @param {string} inputSel - Selector for the input element.
   * @param {string} listSel - Selector for the list element to show suggestions.
   * @returns {void}
   * @side effects Adds event listeners and updates the DOM.
   */
  function init(inputSel, listSel){
    const input = document.querySelector(inputSel);
    const list = document.querySelector(listSel);
    if (!input || !list) return;
    list.setAttribute('aria-live', 'polite');
    let suggestions = [];
    let active = -1;

    fetchSuggestions('content/sample_articles.json')
      .then(d => { suggestions = d; })
      .catch(() => {});
    input.addEventListener('input', () => {
      active = renderList(list, suggestions, input.value.trim().toLowerCase());
    });
    input.addEventListener('keydown', e => {
      active = handleKeyNav(e, list, active);
    });
  }

  const api = { init, fetchSuggestions };
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    global.autocompleteUtils = api;
  }
})(this);
