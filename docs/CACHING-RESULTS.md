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
| `/`                     | BYPASS        | 156 ms / 163 ms           |              |                          |
| `/services`             | BYPASS        | 151 ms / 163 ms           |              |                          |
| `/coach/jessica-rebelo` | BYPASS        | 146 ms / 158 ms           |              |                          |
| `/reviews`              | BYPASS        | 156 ms / 169 ms           |              |                          |
| `/blog`                 | BYPASS        | 139 ms / 149 ms           |              |                          |

Before: measured 2026-10-19 19:34 UTC, after PR #39 deployed (ISR on, cache bypassed).

### Lighthouse (mobile, default throttling, 3 runs, median)

Lighthouse 13.5.0 CLI, headless Chrome, same machine. Before: 2026-10-19, prod after PR #39.

| Page                    | Perf | A11y | Best practices | SEO | LCP    | TBT   | Server response | After: Perf / A11y / LCP / Server |
| ----------------------- | ---- | ---- | -------------- | --- | ------ | ----- | --------------- | --------------------------------- |
| `/`                     | 64   | 100  | 96             | 100 | 25.3 s | 40 ms | 99 ms           |                                   |
| `/services`             | 70   | 98   | 96             | 100 | 18.7 s | 58 ms | 71 ms           |                                   |
| `/coach/jessica-rebelo` | 73   | 98   | 96             | 100 | 6.5 s  | 84 ms | 81 ms           |                                   |

Watch after the merge: A11y must stay the same (the `lang` attribute moved), and CLS must stay 0 (the styled-components CSS moved). LCP is very slow on `/` and `/services`. That is a separate problem (likely images), not caching.

### Cloudflare Worker metrics (last 24 hours)

From Workers & Pages → `unleashedpotentiallifecoaching-web` → Metrics. Each Contentful call is a subrequest.

|                                    | Requests | Subrequests | Subrequests per request |
| ---------------------------------- | -------- | ----------- | ----------------------- |
| Before (2026-10-19, read by Peter) | 1.28k    | 4.05k       | 3.2                     |
| After (24 h after the merge)       |          |             |                         |

Screenshots (desktop: 5 pages; mobile: `/podcast`, `/services`) are kept outside git for the visual check.

Local check (`vite preview`, this PR): first request `MISS`, second request `HIT`. Before this PR, local preview returned `BYPASS`.

## Notes

- The `<html lang="en">` is now set by a small inline script in the head, because vinext's default document has no `lang`. The attribute is in the DOM before the body renders, but not in the raw HTML.
- A slow TTFB number from one machine is a rough signal. The cache header is the main check.
