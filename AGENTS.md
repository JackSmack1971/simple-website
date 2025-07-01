# Simple-Website Enhancement Guide

## Current Repository Structure
```
simple-website/
├── README.md              # BEM-based CSS documentation
├── index.html             # Main HTML template
├── css/
│   ├── style.css          # Current styles (has duplicate CSS variables to fix)
│   ├── performance-optimized.css # Existing performance optimizations
│   └── backup/            # Backup location for CSS files
├── assets/
│   ├── js/               # ES modules (main.js with theme toggle)
│   ├── fonts/            # Target location for Inter & JetBrains Mono
│   └── images/           # Existing images
├── js/                   # Additional JS modules
├── content/              # Content files and data
└── docs/                 # Documentation (target for design-system.md)
```

## Critical Integration Requirements

### CSS Conflict Resolution
**PRIORITY**: Remove duplicate :root declarations in css/style.css under "/* homepage overrides */"
- These cause theme conflicts and must be eliminated first
- Replace hardcoded colors (border: 1px solid #ccc) with CSS custom properties
- Maintain existing BEM structure (.site__header, .nav__menu--open)

### Existing Features to Preserve
- **Theme Toggle**: assets/js/main.js contains working .site--dark class functionality
- **Content Management**: JS modules use fetchJSON with AbortController timeout handling
- **Testing Framework**: Jest setup with DOM mocking and fetch stubbing in autocomplete.test.cjs
- **Security Practices**: No hardcoded API keys, proper error handling patterns

### Design System Integration Strategy
**Step 1**: Create css/design-system/ structure with tokens.css, base.css, components/, utilities.css
**Step 2**: Implement design tokens as specified:
```css
:root {
  --color-primary: #0EA5E9;
  --color-success: #10B981;
  --color-accent: #6B46C1;
  --color-orange: #FF6600;
  --color-danger: #DC2626;
  --font-body: 'Inter', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
}
body.site--dark {
  --bg-color: #0F172A;
  --container-bg: #1E293B;
  --text-color: #F8FAFC;
}
```

## Development Guidelines

### JavaScript Standards
- **Maintain ES6+ modules** structure in assets/js/ and js/
- **Preserve error handling** patterns: ContentFetchError, try/catch blocks
- **Keep AbortController** timeout patterns for fetch operations
- **Maintain theme toggle** functionality in assets/js/main.js

### CSS Architecture Evolution
- **Backup first**: Always copy existing CSS to css/backup/ before changes
- **Preserve BEM**: Maintain existing .block__element--modifier patterns
- **Use design tokens**: Replace hardcoded values with CSS custom properties
- **Mobile-first**: Continue existing responsive approach

### Performance Requirements
- **Font loading**: Use font-display: swap for new Inter and JetBrains Mono fonts
- **Maintain benchmarks**: Don't degrade existing performance-optimized.css benefits
- **Core Web Vitals**: Keep current green scores with new features

## Testing Protocol

### Jest Framework Integration
- **Preserve existing patterns**: DOM mocking, fetch stubbing from autocomplete.test.cjs
- **Test new features**: Add tests for design system, enhanced accessibility, PWA
- **Maintain compatibility**: Ensure existing tests continue to pass
- **Error handling tests**: Extend ContentFetchError testing patterns

### Accessibility Testing
- **WCAG 2.1 AA compliance**: 4.5:1 color contrast minimum (test both themes)
- **Keyboard navigation**: Tab through interface, verify all functionality accessible
- **Screen reader testing**: NVDA/JAWS/VoiceOver compatibility
- **Focus management**: Proper focus indicators and logical tab order

### Performance Validation
- **Lighthouse audits**: Performance, Accessibility, Best Practices, SEO all 90+
- **Core Web Vitals monitoring**: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, FID < 100ms
- **Font loading impact**: Monitor performance effect of new typography
- **PWA performance**: Service worker caching shouldn't degrade metrics

## Risk Management

### Critical Issues to Address
1. **CSS Variable Conflicts**: Eliminate duplicate declarations causing theme issues
2. **Font Performance**: Ensure new fonts don't negatively impact Core Web Vitals
3. **Dark Theme Compatibility**: Test all new features with both light/dark themes
4. **Test Compatibility**: Maintain existing Jest test framework functionality

### Rollback Procedures
- **CSS Backup**: css/backup/ contains original style.css and performance-optimized.css
- **Git History**: Maintain clear commit history for easy rollback
- **Feature Flags**: Consider progressive rollout for major changes
- **Performance Monitoring**: Continuous monitoring of Core Web Vitals

## Security & Best Practices

### Maintain Current Security Standards
- **No API keys**: Continue pattern of no hardcoded secrets
- **Input sanitization**: Follow existing security practices from AGENTS.md
- **CSP compatibility**: Ensure new features work with Content Security Policy
- **Error handling**: Preserve secure error handling without exposing internals

### Progressive Enhancement Strategy
- **Basic functionality first**: Ensure site works without JavaScript
- **Layer enhancements**: Add features progressively
- **Graceful fallbacks**: Provide alternatives for modern features
- **Performance budget**: Don't exceed current loading benchmarks

## Implementation Notes

### File Creation Priority
1. **Backup existing CSS** to css/backup/
2. **Create design system structure** in css/design-system/
3. **Add fonts** to assets/fonts/ with optimized loading
4. **Update imports** in css/style.css to use new design system
5. **Test integration** with existing theme toggle functionality

### Quality Gates
- **Before each phase**: Run existing Jest test suite
- **After CSS changes**: Verify theme toggle still works in both modes
- **After JS enhancements**: Test content management and error handling
- **Before deployment**: Complete accessibility and performance audit

This guide ensures successful integration of UX enhancements while preserving the stability and performance of the existing codebase.
