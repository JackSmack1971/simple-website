# Generative AI Hub Template

This repository contains a modern, responsive website template for Generative AI news and research. It is built with HTML5, CSS3, and vanilla JavaScript following a mobile-first approach and BEM methodology.

## Features
- Homepage with hero section and featured content
- News section with article listings and individual article pages
- Research section with paper summaries and categories
- About and Contact pages
- Navigation menu with active states
- Dark/light mode toggle
- Newsletter signup form and search placeholders
- Social media integration placeholders

## File Structure
```
assets/
  css/style.css   - site styles
  js/main.js      - navigation and theme logic
  images/         - image assets
content/          - sample content in JSON
pages/
  news.html       - news listing
  research.html   - research listing
  about.html      - about page
  contact.html    - contact form
  article.html    - sample news article
  paper.html      - sample research paper
index.html        - homepage
```

## Setup
1. Clone the repository.
2. Open `index.html` in your browser or serve the directory with a local HTTP server:
   ```bash
   python3 -m http.server
   ```
3. Navigate the site to explore different sections.

## Development
- CSS uses the BEM naming convention and relies on modern Flexbox and CSS Grid.
- JavaScript provides progressive enhancement for navigation and dark mode.
- Pages are fully responsive and meet WCAG 2.1 AA guidelines.

## Testing Checklist
- [ ] Verify layout and functionality in Chrome, Firefox, Safari, and Edge.
- [ ] Test mobile responsiveness using browser developer tools.
- [ ] Run accessibility checks (e.g., Lighthouse, axe).
- [ ] Confirm fast loading and good Core Web Vitals metrics.

Feel free to customize the template with your own content and styles.
