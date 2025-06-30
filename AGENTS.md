# Simple-Website UX Enhancement Guide

## Repository Structure
```
simple-website/
├── index.html              # Main HTML template
├── style.css              # Current styles (to be refactored)
├── script.js              # Basic JavaScript (to be enhanced)
├── content/               # Content files and data
├── assets/                # Images, fonts, icons
└── docs/                  # Documentation
```

## Development Guidelines

### CSS Architecture
- Maintain BEM methodology: `.block__element--modifier`
- Use CSS custom properties for theming: `var(--color-primary)`
- Follow mobile-first responsive approach
- Organize styles: atoms → molecules → organisms → utilities

### JavaScript Standards
- Use ES6+ modules and classes
- Implement error handling for all async operations
- Add JSDoc comments for public methods
- Follow semantic naming conventions

### Accessibility Requirements
- All interactive elements must have focus states
- Implement proper ARIA labels and roles
- Ensure 4.5:1 color contrast minimum
- Support keyboard navigation throughout
- Test with screen readers before completion

## Testing Protocol

### Required Validation Steps
1. **Lighthouse Audit**: All scores 90+ (Performance, Accessibility, Best Practices, SEO)
2. **Keyboard Testing**: Tab through entire interface, verify all functionality accessible
3. **Screen Reader**: Test with at least one screen reader (NVDA/JAWS/VoiceOver)
4. **Mobile Testing**: Verify responsive design on mobile devices
5. **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### Performance Benchmarks
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Implementation Notes

### File Organization
When creating new files:
- CSS modules go in `/css/` subdirectory
- JavaScript modules go in `/js/` subdirectory  
- Create `/docs/` for implementation documentation
- Use semantic, descriptive filenames

### Code Quality
- Write self-documenting code with clear variable names
- Add comments for complex logic or accessibility considerations
- Include error handling and loading states
- Validate HTML and CSS before completion

### Progressive Enhancement
- Ensure basic functionality works without JavaScript
- Layer enhancements progressively
- Provide fallbacks for modern CSS features
- Test with JavaScript disabled

## Content Strategy
- Focus on Generative AI and machine learning topics
- Maintain professional, accessible tone
- Include clear calls-to-action
- Optimize for search engine visibility

## Security Considerations
- Sanitize any user inputs
- Use CSP headers for script security
- Validate all external resources
- Implement proper error handling without exposing internals

## Pull Request Guidelines
- Test all changes thoroughly before submitting
- Include screenshots of visual changes
- Document any breaking changes
- Update this AGENTS.md if workflow changes

## Troubleshooting
- Check browser console for JavaScript errors
- Validate HTML and CSS using W3C validators
- Use browser dev tools for debugging layout issues
- Test accessibility with automated tools and manual verification
