# Synthetic browser previews

`h11-*-375.png` checks native 24px class emblems and 12px status glyphs at 375×667: profile, picker, party,
Cleric skill text and battle buffs/debuffs. All names, outfit metadata and portrait placeholders are synthetic.

`h10-effects.gif` is a short montage of sampled browser frames: Brawler, Mage ice on both foes, Spell Blade's
Lance/Lightning pair, Cleric Fire, and a Summoner's fire familiar replaced by ice at 4×. Master data is from
`uma-data/testing`; all names and portrait placeholders are synthetic. The samples are in capture order; pauses
on the familiar views make their replacement visible. Frame sampling is not a performance measurement.

`h16-victory-375x667.jpg` is a cold-load and lazy-action smoke check. All master data came from
`@luismlorenzana/uma-data/testing`; outfit names and the colored rival placeholders are invented. No franchise art or
private release data is included. The disposable five-Uma party is Lv10 with rank 2 classes, not a balance fixture.

H16 tested a minified production build with a temporary **test-only** local-auth override (no production configuration
change), behind a local gzip proxy. The proxy imposed 165 ms/request latency, a shared 1,000,000 bytes/s download
ceiling and 168,750 bytes/s upload ceiling, matching or slightly exceeding Chrome's Fast 4G throttling. Every response
was `no-store`; the test proxy blocked service-worker registration to avoid precache warming. Browser automation
durations are not LCP or React Profiler measurements.
