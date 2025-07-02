# AGENTS.md - CSS Architecture Guidelines

> **Generative AI Hub CSS Standards**  
> Version: 2.0 | Last Updated: July 2025

---

## 🚀 **MODERN CSS FEATURES**

### **Container Queries - RECOMMENDED**
```css
/* Component-aware responsive design */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-md);
  }
}

@container card (min-width: 500px) {
  .card__image {
    aspect-ratio: 16/9;
  }
}
```

### **Logical Properties - REQUIRED**
```css
/* ✅ CORRECT - RTL/LTR compatible */
.component {
  margin-block-start: var(--space-md);
  margin-block-end: var(--space-lg);
  padding-inline: var(--space-sm);
  border-inline-start: 2px solid var(--color-border);
  inset-block-start: 0;
}

/* ❌ INCORRECT - Physical properties */
.component {
  margin-top: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
  border-left: 2px solid var(--color-border);
  top: 0;
}
```

### **Modern Color Spaces - RECOMMENDED**
```css
/* Use OKLCH for better color space and consistency */
@theme {
  --color-primary-50: oklch(0.99 0 0);
  --color-primary-500: oklch(0.84 0.18 117.33);
  --color-primary-900: oklch(0.53 0.12 118.34);
}

/* Wide gamut color support */
@supports (color: oklch(0.7 0.15 142)) {
  .button--primary {
    background-color: oklch(0.7 0.15 142);
  }
}

/* Fallback for older browsers */
@supports not (color: oklch(0.7 0.15 142)) {
  .button--primary {
    background-color: var(--color-primary-500);
  }
}
```

### **CSS Nesting - ALLOWED (with caution)**
```css
/* ✅ CORRECT - Shallow nesting with logical structure */
.card {
  padding: var(--space-md);
  
  &__header {
    margin-block-end: var(--space-sm);
    
    &--featured {
      background: var(--color-accent);
    }
  }
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    padding: var(--space-lg);
  }
}

/* ❌ INCORRECT - Too deeply nested */
.card {
  .header {
    .title {
      .text {
        color: red; /* 4 levels deep - avoid */
      }
    }
  }
}
```

### **Subgrid Support - PROGRESSIVE ENHANCEMENT**
```css
/* Progressive enhancement with subgrid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

@supports (grid-template-rows: subgrid) {
  .card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
  }
}
```

---

## 🎯 **CSS ARCHITECTURE PRINCIPLES**

### **Design Philosophy**
- **Progressive Enhancement**: CSS-first approach with graceful degradation
- **Accessibility First**: WCAG 2.1 AA compliance in all visual implementations
- **Performance Optimized**: Critical path CSS, efficient selectors, minimal repaints
- **Maintainable**: Clear naming conventions, modular structure, documentation

---

## 📁 **FILE STRUCTURE & ORGANIZATION**

### **Required Directory Structure**
```
css/
├── style.css                 # Main stylesheet (entry point)
├── design-system/
│   ├── tokens.css           # Design tokens & CSS custom properties
│   ├── typography.css       # Font families, scales, line heights
│   ├── colors.css           # Color palette & theme definitions
│   └── spacing.css          # Layout spacing system
├── components/
│   ├── buttons.css          # Button component styles
│   ├── forms.css            # Form element styles
│   ├── navigation.css       # Navigation component styles
│   └── cards.css            # Card component styles
├── layout/
│   ├── grid.css             # Grid system utilities
│   ├── flexbox.css          # Flexbox utilities
│   └── containers.css       # Container & wrapper styles
└── utilities/
    ├── accessibility.css    # Screen reader, focus styles
    ├── animations.css       # Transitions & animations
    └── responsive.css       # Breakpoint utilities
```

### **File Naming Conventions**
- **Lowercase with hyphens**: `design-tokens.css`, `button-variants.css`
- **Semantic naming**: Describe purpose, not appearance (`primary-action.css` not `blue-button.css`)
- **Component-based**: One component per file in `components/`

---

## 🎨 **CSS METHODOLOGY & CONVENTIONS**

### **BEM (Block Element Modifier) - MANDATORY**
```css
/* ✅ CORRECT BEM Structure */
.search-form { }                    /* Block */
.search-form__input { }             /* Element */
.search-form__input--large { }      /* Modifier */
.search-form__button { }            /* Element */
.search-form__button--primary { }   /* Modifier */

/* ❌ INCORRECT - Avoid nested elements */
.search-form__input__icon { }       /* Too nested */

/* ❌ INCORRECT - Avoid camelCase */
.searchForm__inputField { }         /* Use hyphens */
```

### **CSS Custom Properties (Required)**
```css
/* ✅ CORRECT - Use design tokens with @theme directive */
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  --space-xs: 0.25rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --radius-sm: 0.25rem;
}

.button {
  background-color: var(--color-primary-500);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
}

/* ❌ INCORRECT - Hardcoded values */
.button {
  background-color: #3b82f6;
  padding: 12px 24px;
}
```

### **Selector Specificity Rules**
- **Max specificity**: `0,0,3,0` (3 classes max)
- **No !important**: Use cascade and specificity properly
- **No IDs in CSS**: Use classes or data attributes
- **Avoid deep nesting**: Max 3 levels deep

```css
/* ✅ CORRECT - Low specificity */
.card { }
.card__header { }
.card__header--featured { }

/* ❌ INCORRECT - Too specific */
#main .sidebar .card .header.featured { }
```

---

## 🔧 **DESIGN SYSTEM INTEGRATION**

### **CSS Custom Properties Structure**
```css
/* tokens.css - REQUIRED structure using @theme directive */
@theme {
  /* Colors - Semantic naming with OKLCH for better color space */
  --color-primary-50: oklch(0.99 0 0);
  --color-primary-100: oklch(0.98 0.04 113.22);
  --color-primary-500: oklch(0.84 0.18 117.33);
  --color-primary-900: oklch(0.53 0.12 118.34);
  
  /* Typography - Scale based with line-height ratios */
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --text-xs: 0.75rem;
  --text-xs--line-height: calc(1 / 0.75);
  --text-base: 1rem;
  --text-base--line-height: calc(1.5 / 1);
  
  /* Spacing - T-shirt sizes with consistent scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Layout - Responsive breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  
  /* Animation - Easing functions */
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}

/* Alternative syntax for accessing theme values in custom CSS */
@layer components {
  .typography {
    color: var(--color-text-primary);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
  }
}
```

### **Theme System Requirements**
```css
/* Dark theme support - REQUIRED */
:root[data-theme="dark"] {
  --color-background: #0f172a;
  --color-text: #f8fafc;
  --color-primary-500: #60a5fa;
}

/* Reduced motion support - REQUIRED */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 **PERFORMANCE STANDARDS**

### **Critical CSS Requirements**
- **Above-fold CSS**: Inline critical styles in `<style>` tag
- **Font loading**: Use `font-display: swap` for web fonts
- **CSS size limit**: Max 150KB uncompressed per CSS file
- **Unused CSS**: Remove unused selectors before production

### **Font Loading Strategy - MANDATORY**
```css
/* Inter Font - Variable font for optimal performance */
@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, 
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, 
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

/* JetBrains Mono - Variable font for code */
@font-face {
  font-family: 'JetBrains Mono';
  src: url('../fonts/jetbrains-mono-variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, 
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, 
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Fallback for older browsers */
@font-face {
  font-family: 'Inter Fallback';
  src: url('../fonts/inter-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Critical font preloading in HTML head */
/*
<link rel="preload" href="../fonts/inter-variable.woff2" as="font" 
      type="font/woff2" crossorigin>
<link rel="preload" href="../fonts/jetbrains-mono-variable.woff2" as="font" 
      type="font/woff2" crossorigin>
*/
```

### **CSS Layer Organization - REQUIRED**
```css
/* Modern cascade layers for predictable styling */
@layer reset, tokens, base, layout, components, utilities, overrides;

@layer reset {
  /* Modern CSS reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
}

@layer tokens {
  /* Design system tokens via @theme */
  @theme {
    --color-primary-500: oklch(0.84 0.18 117.33);
    --space-md: 1rem;
  }
}

@layer base {
  /* Base element styles */
  body {
    font-family: var(--font-body);
    color: var(--color-text-primary);
    background-color: var(--color-background);
  }
}

@layer components {
  /* Component styles */
  .button {
    background: var(--color-primary-500);
    padding: var(--space-md);
  }
}

@layer utilities {
  /* Utility classes with higher specificity */
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
}
```

---

## ♿ **ACCESSIBILITY REQUIREMENTS**

### **Focus Management - MANDATORY**
```css
/* Two-color focus indicator for maximum visibility */
*:focus-visible {
  /* Inner indicator */
  outline: 2px solid #F9F9F9;
  outline-offset: 0;
  /* Outer indicator */
  box-shadow: 0 0 0 4px #193146;
}

/* Component-specific focus styles */
.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
}

/* Remove default outline only when using focus-visible */
.button:focus:not(:focus-visible) {
  outline: none;
}

/* Enhanced focus for form inputs */
input[type="text"]:focus-visible,
input[type="email"]:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-color: var(--color-focus);
}

/* Focus styles for checkbox/radio labels */
input[type="checkbox"]:focus + label,
input[type="radio"]:focus + label {
  background-color: var(--color-focus-background);
  color: var(--color-focus-text);
}
```

### **Color Contrast Standards**
- **Minimum contrast**: 4.5:1 for normal text
- **Large text**: 3:1 for 18px+ or 14px+ bold
- **Non-text elements**: 3:1 for UI components
- **Test with**: WebAIM Contrast Checker

### **Responsive Typography**
```css
/* Fluid typography - REQUIRED for accessibility */
.heading-1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* Respect user preferences */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
  }
}
```

---

## 🧪 **TESTING & VALIDATION**

### **Required CSS Checks**
```bash
# CSS Validation and Linting
npx stylelint "css/**/*.css" --fix
npx prettier "css/**/*.css" --write

# Performance and optimization
npx @css-analyzer/cli css/style.css
npx bundle-analyzer css/

# Accessibility testing
npx axe-core css/ --include css --rules wcag2a,wcag2aa,wcag21aa
npx pa11y-ci --sitemap http://localhost:3000/sitemap.xml
npx lighthouse-ci --collect.url=http://localhost:3000 --assert.preset=lighthouse:accessibility

# Color contrast validation
npx @adobe/leonardo-cli contrast-check --colors="#3b82f6,#ffffff" --background="#ffffff"

# Font loading validation
npx font-display-linter css/
npx font-spider css/ --text-file=content.txt
```

### **Browser Testing Matrix**
- **Desktop**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+
- **Mobile**: iOS Safari 15+, Chrome Mobile 100+
- **Testing tools**: BrowserStack, manual testing on physical devices

### **CSS Quality Gates**
- ✅ **Lint-free**: No stylelint errors
- ✅ **Valid CSS**: W3C CSS Validator passes
- ✅ **Performance**: Lighthouse CSS score 90+
- ✅ **Accessibility**: axe-core tests pass

---

## 🔄 **WORKFLOW & MAINTENANCE**

### **Before Committing CSS**
```bash
# 1. Run CSS linting
npm run lint:css

# 2. Validate CSS syntax
npm run validate:css

# 3. Check performance impact
npm run analyze:css

# 4. Test accessibility
npm run test:a11y
```

### **Commit Message Conventions**
```
feat(css): add new button variant component
fix(css): resolve duplicate :root declarations in style.css
style(css): improve BEM naming in navigation component
perf(css): optimize font loading with font-display swap
```

### **Code Review Checklist**
- [ ] Follows BEM methodology correctly
- [ ] Uses design tokens (no hardcoded values)
- [ ] Maintains proper specificity levels
- [ ] Includes focus states for interactive elements
- [ ] Supports dark theme and reduced motion
- [ ] Font loading optimized with font-display: swap
- [ ] CSS passes all validation tools

---

## 🚨 **CRITICAL RULES**

### **❌ NEVER DO**
- **No duplicate :root or @theme declarations** across files
- **No !important** except for utility classes (.sr-only, etc.)
- **No inline styles** in HTML (use CSS classes)
- **No vendor prefixes** (use autoprefixer in build process)
- **No fixed pixel values** except for borders (use rem/em or design tokens)
- **No hardcoded colors** (always use design tokens)
- **No focus: { outline: none }** without focus-visible alternative

### **✅ ALWAYS DO**
- **Use @theme directive** for design token definitions
- **Use semantic class names** that describe purpose (not appearance)
- **Follow BEM methodology** consistently with prefix
- **Test with screen readers** and keyboard navigation
- **Validate CSS** with stylelint and accessibility tools
- **Use CSS layers** for predictable cascade management
- **Document complex selectors** with comments
- **Use CSS custom properties** for all themed values
- **Implement two-color focus indicators** for WCAG compliance
- **Use font-display: swap** for web font loading
- **Test color contrast** ratios (4.5:1 minimum)

---

## 📚 **RESOURCES & REFERENCES**

- **BEM Methodology**: https://getbem.com/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Performance**: https://web.dev/css-web-vitals/
- **Font Loading**: https://web.dev/font-display/

---

**⚡ Remember: This CSS architecture enables the Generative AI Hub to be accessible, performant, and maintainable. Every CSS decision should align with these principles.**
