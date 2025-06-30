(function() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
        navToggle.setAttribute('aria-expanded', !expanded);
        navMenu.classList.toggle('nav__menu--open');
    });

    themeToggle.addEventListener('click', () => {
        const darkMode = body.classList.toggle('site--dark');
        themeToggle.textContent = darkMode ? '\u263E' : '\u2600';
    });

    const fadeElements = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('is-visible'));
    }

    if (window.filterUtils) {
        const { setupSearch, setupCategoryFilter } = window.filterUtils;
        setupSearch('#news-search', '.news-list');
        setupSearch('#paper-search', '.paper-list');
        setupCategoryFilter('#category-filter', '.paper-list');
    }
})();
