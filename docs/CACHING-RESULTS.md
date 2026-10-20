# Page caching: before and after

Tracks the effect of the caching work: ISR on the Pages Router (PR #39) and the removal of `pages/_document.tsx` (this PR). Linear: TWS-96.

## Why

vinext turns off its shared page cache when a custom `pages/_document.tsx` exists. The site had one (for styled-components server styles and the Google Fonts links). So every visit rendered the page again and called Contentful, even after ISR (`revalidate: 300`) shipped. Production returned `x-vinext-cache: BYPASS` on every request.

The fix: move the styled-components CSS into `styles/globals.css` (same rules, plain class names), move the font links and `lang="en"` into `pages/_app.tsx`, and delete `_document.tsx`.

## How it is measured

- **Cache status:** the `x-vinext-cache` response header. `BYPASS` = not cached. `MISS` = rendered and stored. `HIT` / `STALE` = served from the cache.
- **TTFB:** time to first byte, 15 requests per page from one machine (Kansas City, Cloudflare MCI), 1 warm-up request first. Median and p90.
- Command for one page:

```sh
for i in $(seq 1 15); do curl -s -o /dev/null -w "%{http_code} %{time_starttransfer}\n" https://jessrebelo.com/services; done
```

- Later: Contentful API calls per day (Contentful usage page), and Lighthouse on the same 3 pages as `docs/MIGRATION-RESULTS.md`.

## Results

| Page                    | Before: cache | Before: TTFB median / p90 | After: cache | After: TTFB median / p90 |
| ----------------------- | ------------- | ------------------------- | ------------ | ------------------------ |
| `/`                     | BYPASS        | 156 ms / 163 ms           | HIT          | 141 ms / 152 ms          |
| `/services`             | BYPASS        | 151 ms / 163 ms           | HIT          | 138 ms / 155 ms          |
| `/coach/jessica-rebelo` | BYPASS        | 146 ms / 158 ms           | HIT          | 142 ms / 219 ms          |
| `/reviews`              | BYPASS        | 156 ms / 169 ms           | HIT          | 130 ms / 158 ms          |
| `/blog`                 | BYPASS        | 139 ms / 149 ms           | HIT          | 130 ms / 151 ms          |

Before: measured 2026-10-19 19:34 UTC, after PR #39 deployed (ISR on, cache bypassed).
After: measured 2026-10-19 after PR #40 deployed. GET requests return `HIT` after 1–2 warm-up requests. TTFB median dropped 4–26 ms per page (the cache saves the render and the Contentful calls, but the edge round trip from this machine is most of the time).

### Lighthouse (mobile, default throttling, 3 runs, median)

Lighthouse 13.5.0 CLI, headless Chrome, same machine. Before: 2026-10-19, prod after PR #39.

| Page                    | Perf | A11y | Best practices | SEO | LCP    | TBT   | Server response | After: Perf / A11y / LCP / Server |
| ----------------------- | ---- | ---- | -------------- | --- | ------ | ----- | --------------- | --------------------------------- |
| `/`                     | 64   | 100  | 96             | 100 | 25.3 s | 40 ms | 99 ms           | 71 / 100 / 24.1 s / 54 ms         |
| `/services`             | 70   | 98   | 96             | 100 | 18.7 s | 58 ms | 71 ms           | 71 / 98 / 22.0 s / 66 ms          |
| `/coach/jessica-rebelo` | 73   | 98   | 96             | 100 | 6.5 s  | 84 ms | 81 ms           | 73 / 98 / 6.7 s / 58 ms           |

After the merge: A11y is the same on all 3 pages, `html-has-lang` passes, CLS stays 0, and server response dropped to 54–66 ms (from 71–99 ms). Perf moved within run-to-run noise.

Watched: A11y must stay the same (the `lang` attribute moved), and CLS must stay 0 (the styled-components CSS moved). LCP is very slow on `/` and `/services`. That is a separate problem (likely images), not caching.

### Cloudflare Worker metrics (by day)

From Workers & Pages → `unleashedpotentiallifecoaching-web` → Metrics. Each Contentful call is a subrequest.

|                                        | Asset requests | Subrequests | Subrequests per asset request |
| -------------------------------------- | -------------- | ----------- | ----------------------------- |
| Before (2026-10-19, read by Peter)     | 1.28k          | 4.05k       | 3.2                           |
| Oct 19, full day (deploy day, mixed)   | 2.73k          | 10.93k      | 4.0                           |
| Oct 20, full day (first full day after) | to read on Oct 21 |          |                               |

All rows are the "Asset requests" number from the Metrics page (the dashboard did not show the Worker request count), so they compare the same thing. The "Before" row is the last 24 hours, read on Oct 19 before the merge.

Oct 19 is not a clean "after" day. PR #40 deployed during the day, so the day has hours before and after the change. It also has the test traffic from the measurements above (curl loops and Lighthouse runs), and each new deploy starts with an empty cache. Oct 20 is the first full day after the change, so it is the real comparison. A partial reading on Oct 20 (2.03k asset requests, 5.21k subrequests, 2.6 per request) is not used, because the day was not over.

Screenshots (desktop: 5 pages; mobile: iPhone 16 Pro Max) are kept outside git for the visual check.

Local check (`vite preview`, this PR): first request `MISS`, second request `HIT`. Before this PR, local preview returned `BYPASS`.

## Notes

- The `<html lang="en">` is now set by a small inline script in the head, because vinext's default document has no `lang`. The attribute is in the DOM before the body renders, but not in the raw HTML.
- A slow TTFB number from one machine is a rough signal. The cache header is the main check.
