# Synthetic browser previews

`h16-victory-375x667.jpg` is a cold-load and lazy-action smoke check. All master data came from
`@luismlorenzana/uma-data/testing`; outfit names and the colored rival placeholders are invented. No franchise art or
private release data is included. The disposable five-Uma party is Lv10 with rank 2 classes, not a balance fixture.

H16 tested a minified production build with a temporary **test-only** local-auth override (no production configuration
change), behind a local gzip proxy. The proxy imposed 165 ms/request latency, a shared 1,000,000 bytes/s download
ceiling and 168,750 bytes/s upload ceiling, matching or slightly exceeding Chrome's Fast 4G throttling. Every response
was `no-store`; the test proxy blocked service-worker registration to avoid precache warming. Browser automation
durations are not LCP or React Profiler measurements.
