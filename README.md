# Generative AI Hub Template

This project is a modern, responsive website template built with **HTML5**, **CSS3**, and **vanilla JavaScript**. It is designed for publishing Generative AI news and research while following accessibility and performance best practices.

## Project Setup
1. **Clone the repository** and install dependencies for optional tooling:
   ```bash
   git clone <repo-url>
   cd simple-website
   npm install      # optional: required only for running tests or build scripts
   ```
2. **Serve the site locally**. Any static HTTP server will work. For quick testing:
   ```bash
   npx http-server -p 8080
   ```
   Then open `http://localhost:8080/index.html` in your browser.

## File Structure
```
css/             Site styles organized with BEM methodology
assets/
  js/             JavaScript modules for navigation and utilities
  images/         Optimized graphics
content/          Sample JSON data for articles and research papers
pages/            Individual HTML page templates
index.html        Homepage
```
These directories match the recommendations in `AGENTS.md` and keep styles, scripts, images, and content logically separated.

## Content Management Guidelines
- **Articles and Research**: Add or edit JSON files in `content/` to update posts.
- **Schema Markup**: Each news article should include structured data following [Schema.org](https://schema.org/Article) guidelines.
- **Accessibility**: Use semantic HTML tags and keep contrast ratios high to satisfy WCAG&nbsp;2.1&nbsp;AA.
- **BEM CSS**: Follow the Block&nbsp;-- Element&nbsp;-- Modifier convention for class names (e.g., `post__title`, `nav__menu--open`).

## Deployment
### GitHub Pages
1. Ensure dependencies are installed: `npm install`.
2. Build the site:
   ```bash
   npm run build
   ```
3. Deploy with:
   ```bash
   npm run deploy
   ```
This uses the `gh-pages` package to push the contents of the `dist/` folder to the `gh-pages` branch.

### Other Hosts
Run `npm run build` and upload the generated `dist/` directory to any static host (Netlify, Vercel, traditional web servers, etc.).

## Customization Guide
- **Add New Sections**: Copy an existing page from `pages/` and modify it to cover a new topic (e.g., "Tutorials"). Update navigation links in `index.html`.
- **Styling**: Edit or extend styles in `css/`. Keep classes in BEM format and test on mobile as well as desktop.
- **Homepage Overrides**: All inline homepage styles have been moved to `css/style.css` under the comment `/* homepage overrides */`.
- **Scripts**: Modify `assets/js/` modules to add functionality. For any API calls, place keys in environment variables, validate inputs, and add retry logic with timeouts.
- **Content Topics**: Replace sample files in `content/` with your own datasets. Use consistent naming to make filtering easier.

## Testing and Quality Checks
- Cross-browser verification (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness checks via browser tools
- Accessibility validation using Lighthouse or similar tools
- Performance optimization to maintain good Core Web Vitals
- Automated unit tests can be run with `npm test`

Feel free to adapt this template for your own Generative AI or tech-related website. Contributions are welcome!
