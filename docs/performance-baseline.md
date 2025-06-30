# Performance Baseline

Initial Lighthouse metrics measured locally.

| Metric | Value |
|-------|-------|
| Largest Contentful Paint (LCP) | 2.5 s |
| First Input Delay (FID) | 20 ms |
| Cumulative Layout Shift (CLS) | 0.01 |

JSON reports are stored under [docs/perf-reports](perf-reports/).

## Image Dimensions

Images for articles and news items use a 2:1 aspect ratio. Placeholder files are provided at 800x400 px and 400x200 px sizes, and these values are set as `width` and `height` attributes to avoid layout shifts.
