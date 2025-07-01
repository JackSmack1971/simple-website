(function(global) {
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
