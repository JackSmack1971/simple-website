(function(global) {
    /**
     * Enable text filtering of posts within a list.
     * @param {string} inputSelector - Selector for the search input.
     * @param {string} listSelector - Selector for the list container.
     * @returns {void}
     * @side effects Adds an input event listener and hides/show elements.
     */
    function setupSearch(inputSelector, listSelector) {
        const input = document.querySelector(inputSelector);
        const list = document.querySelector(listSelector);
        if (!input || !list) return;
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            list.querySelectorAll('.post').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    /**
     * Filter posts based on a category select element.
     * @param {string} selectSelector - Selector for the dropdown.
     * @param {string} listSelector - Selector for the list container.
     * @returns {void}
     * @side effects Adds a change listener and hides/show elements.
     */
    function setupCategoryFilter(selectSelector, listSelector) {
        const select = document.querySelector(selectSelector);
        const list = document.querySelector(listSelector);
        if (!select || !list) return;
        select.addEventListener('change', () => {
            const value = select.value;
            list.querySelectorAll('.post').forEach(item => {
                const meta = item.querySelector('.post__meta');
                const match = meta && meta.textContent.includes(value);
                item.style.display = value === 'all' || match ? '' : 'none';
            });
        });
    }

    /**
     * Filter posts when buttons are clicked.
     * @param {string} buttonSelector - Selector for filter buttons.
     * @param {string} listSelector - Selector for the list container.
     * @returns {void}
     * @side effects Adds click listeners and modifies the DOM.
     */
    function setupButtonFilter(buttonSelector, listSelector) {
        const buttons = document.querySelectorAll(buttonSelector);
        const list = document.querySelector(listSelector);
        if (!buttons.length || !list) return;
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.topic;
                buttons.forEach(b => b.classList.remove('filter-button--active'));
                btn.classList.add('filter-button--active');
                list.querySelectorAll('.post').forEach(item => {
                    const meta = item.querySelector('.post__meta');
                    const match = meta && meta.textContent.includes(value);
                    item.style.display = value === 'all' || match ? '' : 'none';
                });
            });
        });
    }

    const api = { setupSearch, setupCategoryFilter, setupButtonFilter };
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        global.filterUtils = api;
    }
})(this);
