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
})();
