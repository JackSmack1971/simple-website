/** @jest-environment jsdom */
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');
const { axe, toHaveNoViolations } = require('jest-axe');
const fs = require('fs');

expect.extend(toHaveNoViolations);

const html = fs.readFileSync('index.html', 'utf8');

function getHtml(theme) {
  if (theme === 'dark') {
    return html.replace('site--light', 'site--dark');
  }
  return html;
}

describe('Accessibility checks', () => {
  test('light theme has no violations', async () => {
    const results = await axe(getHtml('light'));
    expect(results).toHaveNoViolations();
  });

  test('dark theme has no violations', async () => {
    const results = await axe(getHtml('dark'));
    expect(results).toHaveNoViolations();
  });
});
