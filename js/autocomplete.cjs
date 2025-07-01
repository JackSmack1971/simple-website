(function(global){
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

  function init(inputSel, listSel){
    const input = document.querySelector(inputSel);
    const list = document.querySelector(listSel);
    if (!input || !list) return;
    let suggestions = [];
    fetchSuggestions('content/sample_articles.json')
      .then(data => { suggestions = data; })
      .catch(() => {});
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      list.innerHTML = '';
      if (!q || q.length > 50) return;
      suggestions.filter(a => a.title.toLowerCase().includes(q))
        .slice(0,5).forEach(item => {
          const li = document.createElement('li');
          li.className = 'hero__suggestion';
          li.textContent = item.title;
          list.appendChild(li);
        });
    });
  }

  const api = { init, fetchSuggestions };
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    global.autocompleteUtils = api;
  }
})(this);
