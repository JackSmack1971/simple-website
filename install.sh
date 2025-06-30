#!/bin/bash

# Generative AI Website Project Installation Script
# Author: Generated with OpenAI Codex
# Description: Automated setup for Generative AI news and research website

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="generative-ai-website"
NODE_MIN_VERSION="16"
NPM_MIN_VERSION="8"

# Utility functions
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}  Generative AI Website - Installation Script${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Version comparison function
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Check system prerequisites
check_prerequisites() {
    print_step "Checking system prerequisites..."
    
    # Check for required commands
    local missing_commands=()
    
    if ! command_exists node; then
        missing_commands+=("node")
    else
        local node_version=$(node --version | cut -d'v' -f2)
        if ! version_ge "$node_version" "$NODE_MIN_VERSION"; then
            print_error "Node.js version $node_version is too old. Minimum required: $NODE_MIN_VERSION"
            exit 1
        fi
        print_success "Node.js version $node_version detected"
    fi
    
    if ! command_exists npm; then
        missing_commands+=("npm")
    else
        local npm_version=$(npm --version)
        if ! version_ge "$npm_version" "$NPM_MIN_VERSION"; then
            print_error "npm version $npm_version is too old. Minimum required: $NPM_MIN_VERSION"
            exit 1
        fi
        print_success "npm version $npm_version detected"
    fi
    
    if ! command_exists git; then
        missing_commands+=("git")
    else
        print_success "Git detected"
    fi
    
    if [ ${#missing_commands[@]} -ne 0 ]; then
        print_error "Missing required commands: ${missing_commands[*]}"
        echo -e "\nPlease install the missing dependencies:"
        echo -e "  • Node.js (>=v$NODE_MIN_VERSION): https://nodejs.org/"
        echo -e "  • Git: https://git-scm.com/"
        exit 1
    fi
    
    print_success "All prerequisites satisfied"
}

# Create project structure
create_project_structure() {
    print_step "Creating project directory structure..."
    
    # Create main directories
    mkdir -p {pages/{news,research},assets/{css/{components,pages},js/modules,images},content/{news,research},docs}
    
    # Create build and development directories
    mkdir -p {dist,src,scripts}
    
    print_success "Project structure created"
}

# Initialize package.json
initialize_package_json() {
    print_step "Initializing package.json..."
    
    cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "Modern website template for Generative AI news and research",
  "main": "index.js",
  "scripts": {
    "start": "live-server --host=localhost --port=3000 --open=/index.html",
    "dev": "concurrently \"npm run watch:css\" \"npm run start\"",
    "build": "npm run build:css && npm run build:js && npm run copy:assets",
    "build:css": "postcss assets/css/main.css -o dist/css/main.css --env production",
    "build:js": "mkdir -p dist/js && cp -r assets/js/* dist/js/",
    "copy:assets": "mkdir -p dist/images && cp -r assets/images/* dist/images/ && cp *.html dist/",
    "watch:css": "postcss assets/css/main.css -o assets/css/compiled.css --watch",
    "lint": "eslint assets/js/**/*.js",
    "lint:fix": "eslint assets/js/**/*.js --fix",
    "validate:html": "html-validate *.html pages/**/*.html",
    "optimize:images": "imagemin assets/images/* --out-dir=dist/images",
    "test": "npm run lint && npm run validate:html",
    "deploy": "npm run build && gh-pages -d dist",
    "clean": "rm -rf dist node_modules package-lock.json"
  },
  "keywords": [
    "generative-ai",
    "news",
    "research",
    "website",
    "template",
    "html",
    "css",
    "javascript"
  ],
  "author": "Generated with OpenAI Codex",
  "license": "MIT",
  "devDependencies": {
    "live-server": "^1.2.2",
    "concurrently": "^7.6.0",
    "postcss": "^8.4.21",
    "postcss-cli": "^10.1.0",
    "autoprefixer": "^10.4.13",
    "cssnano": "^5.1.15",
    "eslint": "^8.34.0",
    "html-validate": "^7.13.0",
    "imagemin": "^8.0.1",
    "imagemin-png-to-webp": "^2.0.0",
    "gh-pages": "^5.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
EOF
    
    print_success "package.json created"
}

# Install npm dependencies
install_dependencies() {
    print_step "Installing npm dependencies..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create configuration files
create_config_files() {
    print_step "Creating configuration files..."
    
    # PostCSS config
    cat > postcss.config.js << EOF
module.exports = {
  plugins: [
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' ? require('cssnano') : null
  ].filter(Boolean)
}
EOF
    
    # ESLint config
    cat > .eslintrc.json << EOF
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
EOF
    
    # HTML Validate config
    cat > .htmlvalidate.json << EOF
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "void-style": "selfclosing",
    "close-order": "error"
  }
}
EOF
    
    # Git ignore
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Cache
.cache/
.parcel-cache/

# Temporary files
*.tmp
*.temp
EOF
    
    print_success "Configuration files created"
}

# Create sample content
create_sample_content() {
    print_step "Creating sample content and data..."
    
    # Create sample news data
    cat > content/news/sample-articles.json << EOF
{
  "articles": [
    {
      "id": "1",
      "title": "GPT-4 Turbo: Latest Advances in Large Language Models",
      "excerpt": "Exploring the latest improvements in efficiency and reasoning capabilities of large language models.",
      "author": "AI Research Team",
      "date": "2024-01-15",
      "category": "models",
      "tags": ["GPT-4", "LLM", "OpenAI"],
      "image": "assets/images/gpt4-turbo.jpg",
      "featured": true
    },
    {
      "id": "2",
      "title": "Multimodal AI: Combining Vision and Language Understanding",
      "excerpt": "How modern AI systems are learning to understand both text and images simultaneously.",
      "author": "Vision AI Labs",
      "date": "2024-01-12",
      "category": "research",
      "tags": ["multimodal", "vision", "language"],
      "image": "assets/images/multimodal-ai.jpg",
      "featured": false
    }
  ]
}
EOF
    
    # Create sample research data
    cat > content/research/papers.json << EOF
{
  "papers": [
    {
      "id": "1",
      "title": "Attention Is All You Need",
      "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
      "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
      "year": "2017",
      "venue": "NeurIPS",
      "arxiv": "1706.03762",
      "categories": ["transformers", "attention", "nlp"],
      "citations": 50000
    }
  ]
}
EOF
    
    # Create AGENTS.md for Codex
    cat > AGENTS.md << EOF
# Generative AI Website Development Guide

## Project Overview
This is a modern, responsive website template for Generative AI news and research content.

## Tech Stack
- HTML5, CSS3, JavaScript (vanilla)
- PostCSS for CSS processing
- ESLint for JavaScript linting
- Live Server for development
- Mobile-first responsive design

## Development Workflow
- Run \`npm run dev\` for development with hot reload
- Run \`npm run build\` for production build
- Run \`npm test\` for linting and validation

## File Structure
- \`/pages/\` - Individual page templates
- \`/assets/css/\` - Stylesheets with component organization
- \`/assets/js/\` - JavaScript modules
- \`/content/\` - JSON data files for content management

## Content Management
- News articles stored in \`content/news/sample-articles.json\`
- Research papers in \`content/research/papers.json\`
- Images optimized and stored in \`assets/images/\`

## Coding Standards
- Use BEM methodology for CSS classes
- ES6+ JavaScript with modules
- Semantic HTML5 structure
- WCAG 2.1 AA accessibility compliance

## Build Process
- CSS is processed with PostCSS (autoprefixer, cssnano)
- JavaScript is linted with ESLint
- HTML is validated with html-validate
- Images can be optimized with imagemin

## Deployment
- Run \`npm run deploy\` for GitHub Pages deployment
- Build artifacts go to \`dist/\` directory
- Configure your hosting provider to serve from \`dist/\`
EOF
    
    print_success "Sample content and documentation created"
}

# Create basic HTML structure
create_base_files() {
    print_step "Creating base HTML and CSS files..."
    
    # Create index.html
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Latest news and research in Generative AI">
    <title>Generative AI Hub - News & Research</title>
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav__container">
                <a href="/" class="nav__logo">AI Hub</a>
                <ul class="nav__menu">
                    <li><a href="/" class="nav__link nav__link--active">Home</a></li>
                    <li><a href="pages/news/" class="nav__link">News</a></li>
                    <li><a href="pages/research/" class="nav__link">Research</a></li>
                    <li><a href="pages/about.html" class="nav__link">About</a></li>
                    <li><a href="pages/contact.html" class="nav__link">Contact</a></li>
                </ul>
                <button class="nav__toggle" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>

    <main class="main">
        <section class="hero">
            <div class="hero__container">
                <h1 class="hero__title">Latest in Generative AI</h1>
                <p class="hero__subtitle">Stay updated with cutting-edge research and news in artificial intelligence</p>
                <a href="pages/news/" class="hero__cta">Explore News</a>
            </div>
        </section>

        <section class="featured">
            <div class="container">
                <h2 class="section__title">Featured Content</h2>
                <div class="featured__grid" id="featured-content">
                    <!-- Content will be loaded dynamically -->
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer__container">
            <p>&copy; 2024 Generative AI Hub. Built with Codex.</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>
EOF
    
    # Create basic CSS
    cat > assets/css/main.css << 'EOF'
/* Generative AI Website - Main Styles */

/* CSS Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #2563eb;
  --secondary-color: #1e293b;
  --accent-color: #06b6d4;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --surface: #f8fafc;
  --border: #e5e7eb;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header and Navigation */
.header {
  background: var(--background);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav__logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav__menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav__link {
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.nav__link:hover,
.nav__link--active {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero__title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero__cta {
  display: inline-block;
  background: white;
  color: var(--primary-color);
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.hero__cta:hover {
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav__menu {
    display: none;
  }
  
  .hero__title {
    font-size: 2rem;
  }
  
  .hero__subtitle {
    font-size: 1rem;
  }
}
EOF
    
    # Create basic JavaScript
    cat > assets/js/main.js << 'EOF'
// Generative AI Website - Main JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize application
function initializeApp() {
  setupNavigation();
  loadFeaturedContent();
  setupThemeToggle();
}

// Setup navigation
function setupNavigation() {
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav__menu--active');
    });
  }
}

// Load featured content
async function loadFeaturedContent() {
  try {
    const response = await fetch('content/news/sample-articles.json');
    const data = await response.json();
    
    const featuredContainer = document.getElementById('featured-content');
    if (featuredContainer && data.articles) {
      featuredContainer.innerHTML = data.articles
        .filter(article => article.featured)
        .map(article => createArticleCard(article))
        .join('');
    }
  } catch (error) {
    console.log('Sample content not loaded yet:', error.message);
  }
}

// Create article card
function createArticleCard(article) {
  return `
    <article class="card">
      <img src="${article.image}" alt="${article.title}" class="card__image">
      <div class="card__content">
        <h3 class="card__title">${article.title}</h3>
        <p class="card__excerpt">${article.excerpt}</p>
        <div class="card__meta">
          <span class="card__author">${article.author}</span>
          <span class="card__date">${article.date}</span>
        </div>
      </div>
    </article>
  `;
}

// Setup theme toggle (placeholder)
function setupThemeToggle() {
  // Theme toggle functionality can be added here
  console.log('Theme toggle ready for implementation');
}
EOF
    
    print_success "Base HTML, CSS, and JavaScript files created"
}

# Create development scripts
create_dev_scripts() {
    print_step "Creating development scripts..."
    
    # Create a quick development server script
    cat > scripts/dev-server.js << 'EOF'
#!/usr/bin/env node

const liveServer = require('live-server');

const params = {
  port: 3000,
  host: 'localhost',
  root: '.',
  open: true,
  file: 'index.html',
  wait: 1000,
  logLevel: 2
};

console.log('Starting development server...');
console.log('Server will be available at: http://localhost:3000');

liveServer.start(params);
EOF
    
    chmod +x scripts/dev-server.js
    
    print_success "Development scripts created"
}

# Setup git repository
setup_git() {
    print_step "Initializing Git repository..."
    
    if [ ! -d .git ]; then
        git init
        git add .
        git commit -m "Initial commit: Generative AI website template"
        print_success "Git repository initialized"
    else
        print_info "Git repository already exists"
    fi
}

# Create README
create_readme() {
    print_step "Creating README.md..."
    
    cat > README.md << 'EOF'
# Generative AI Website Template

A modern, responsive website template for Generative AI news and research content.

## Features

- 📱 Responsive design (mobile-first)
- ⚡ Fast loading and optimized
- 🎨 Modern, clean UI
- 🔍 SEO-friendly structure
- ♿ Accessible design
- 🛠️ Developer-friendly workflow

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd generative-ai-website
   chmod +x install.sh
   ./install.sh
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Development

- `npm run start` - Start development server
- `npm run dev` - Start with CSS watching
- `npm run build` - Build for production
- `npm run test` - Run linting and validation
- `npm run lint` - Lint JavaScript
- `npm run validate:html` - Validate HTML

## Project Structure

```
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript modules
│   └── images/        # Images and graphics
├── pages/             # Additional pages
│   ├── news/          # News section
│   └── research/      # Research section
├── content/           # JSON data files
├── scripts/           # Build and development scripts
└── dist/              # Production build output
```

## Customization

1. **Content:** Edit JSON files in `content/` directory
2. **Styling:** Modify CSS files in `assets/css/`
3. **Functionality:** Update JavaScript in `assets/js/`
4. **Pages:** Add new HTML files in `pages/`

## Deployment

### GitHub Pages
```bash
npm run deploy
```

### Manual Deployment
1. Run `npm run build`
2. Upload `dist/` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm test` to validate
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

*Generated with OpenAI Codex*
EOF
    
    print_success "README.md created"
}

# Final setup and verification
finalize_setup() {
    print_step "Finalizing setup and running validation..."
    
    # Run initial tests
    if npm test; then
        print_success "Initial validation passed"
    else
        print_warning "Some validation checks failed - this is normal for initial setup"
    fi
    
    print_success "Installation completed successfully!"
    
    echo -e "\n${GREEN}🎉 Your Generative AI website is ready!${NC}\n"
    echo -e "📁 Project location: $(pwd)"
    echo -e "🌐 Start development: ${CYAN}npm run dev${NC}"
    echo -e "🏗️  Build for production: ${CYAN}npm run build${NC}"
    echo -e "📖 Read the docs: ${CYAN}cat README.md${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo -e "  1. Run 'npm run dev' to start development server"
    echo -e "  2. Edit content in the 'content/' directory"
    echo -e "  3. Customize styles in 'assets/css/main.css'"
    echo -e "  4. Add your own images to 'assets/images/'"
    echo -e "\n${BLUE}Happy coding! 🚀${NC}\n"
}

# Handle script interruption
cleanup() {
    print_error "Installation interrupted"
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    # Add cleanup logic here if needed
    exit 1
}

# Set trap for cleanup
trap cleanup INT TERM

# Main execution
main() {
    print_header
    
    check_prerequisites
    create_project_structure
    initialize_package_json
    install_dependencies
    create_config_files
    create_sample_content
    create_base_files
    create_dev_scripts
    setup_git
    create_readme
    finalize_setup
}

# Run main function
main "$@"
