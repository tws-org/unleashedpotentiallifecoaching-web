# Baseline: Unleashed Potential Life Coaching (before migration)

Snapshot: commit `85ff22c` (2022-03-29, "removed caching for pages"), the last commit on Prismic before the Contentful migration began (`898cbc7`, 2022-06-10)
Live site at the time: https://www.unleashedpotentiallifecoaching.com/
Recorded: 2026-10-09

The Wayback Machine's earliest capture of the domain is 2021-12-28, so it has no record of anything older than this Next.js + Prismic version. This is the "old site" for the comparison in [MIGRATION-RESULTS.md](MIGRATION-RESULTS.md).

## Stack

| Layer     | Tech                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 12 (`"next": "latest"` in package.json, so the version was not pinned) |
| UI        | React 17, TypeScript 4.5.4, Tailwind 3, styled-components 5, Framer Motion 6   |
| CMS       | Prismic (`prismic-javascript`), queried over its GraphQL API at request time   |
| Email     | SendGrid through `/api/send-email`                                             |
| Video     | YouTube Data API, key in `NEXT_PUBLIC_YT_API_KEY` (shipped to the browser)     |
| Hosting   | Vercel                                                                         |

## Checks

| Check                                 | Result                                                                                                                                                                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup steps in the README             | None                                                                                                                                                                                                              |
| Node version specified                | None (no `engines` field)                                                                                                                                                                                         |
| Environment variables the code reads  | 7: `PRISMIC_REPOSITORY_NAME`, `PRISMIC_API_TOKEN`, `PRISMIC_REPOSITORY_LOCALE`, `SENDGRID_API_KEY`, `TO_EMAIL_ADDRESS`, `NEXT_PUBLIC_YT_API_KEY`, `NEXT_PUBLIC_CHANNEL_ID`. None of them are documented           |
| Dependencies in package.json          | 13 runtime, 13 dev. 387 entries in yarn.lock                                                                                                                                                                      |
| Source size                           | 67 files, 2,987 lines (pages, components, utils, contexts, hooks, layouts, types)                                                                                                                                 |
| Routes                                | 10: `/`, `/our-story`, `/services`, `/coach/[slug]`, `/podcast`, `/reviews`, `/disclaimer`, `/sitemap.xml`, `/api/send-email`, `/404`                                                                             |
| Rendering                             | 7 of 10 routes server-rendered on every request (`getServerSideProps`). Only `/404` and `/disclaimer` were static                                                                                                 |
| Production cache headers              | `cache-control: private, no-cache, no-store, max-age=0, must-revalidate` and `x-vercel-cache: MISS` on all 5 Wayback captures from 2022-05 to 2022-10, so every visit ran the page function and a Prismic request |
| `next build`                          | Passes on Node 22 with `NODE_OPTIONS=--openssl-legacy-provider` (webpack 4-era hashing). 7.7 s                                                                                                                    |
| First Load JS (from the build output) | 86.9 kB shared. Home 149 kB, `/services` 149 kB, `/coach/[slug]` 149 kB, `/our-story` 144 kB, `/podcast` 121 kB, `/reviews` 121 kB                                                                                |
| Runs as committed today               | No. Every CMS-backed page returns 500. The GraphQL query is put into the URL without encoding (`?query=${query}`), and Prismic now rejects that with 400. When that one request fails, the whole page fails       |
| `yarn audit` (today, runtime deps)    | 37 vulnerabilities in 129 packages: 5 critical (`next` ×2, `@babel/traverse`, `loader-utils`, `minimist`), 12 high, 18 moderate, 2 low. All deps: 142 (8 critical)                                                |
| Tests                                 | None                                                                                                                                                                                                              |

## Measured

To measure the old site, I built `85ff22c` in a scratch worktree and pointed it at the original Prismic repository, which is still publicly readable. It needed two local-only patches in `utils/api.js`: URL-encoding the query, and leaving out the `Authorization` header when no token is set. Nothing was committed. The framework and main chunk hashes from this build match the 2022-05-18 Wayback capture of production. The `_app` chunk differs.

### Lighthouse (home page)

Lighthouse 12.8.2, mobile, simulated throttling, headless Chrome in incognito, 3 runs against `next start` on localhost. Medians.

| Category       | Score |
| -------------- | ----- |
| Performance    | 73    |
| Accessibility  | 96    |
| Best Practices | 100   |
| SEO            | 100   |

| Metric                 | Value                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| FCP                    | 2.8 s                                                                                                  |
| LCP                    | 4.8 s                                                                                                  |
| Speed Index            | 5.4 s                                                                                                  |
| TBT                    | 0 ms                                                                                                   |
| CLS                    | 0 (one run measured 0.118)                                                                             |
| Total transfer         | 578 KiB, 28 requests                                                                                   |
| JavaScript transferred | 159 KiB                                                                                                |
| LCP element            | Hero banner (CSS background). Prismic's image CDN served it as a 301 KiB AVIF (`auto=compress,format`) |
| Root document          | 290–340 ms (the page waits for Prismic before it can respond)                                          |

### Server response time

20 requests per page against `next start` on localhost, time to first byte:

| Page                    | Median | p90    |
| ----------------------- | ------ | ------ |
| `/`                     | 92 ms  | 99 ms  |
| `/services`             | 89 ms  | 102 ms |
| `/reviews`              | 61 ms  | 76 ms  |
| `/podcast`              | 59 ms  | 63 ms  |
| `/coach/jessica-rebelo` | 58 ms  | 63 ms  |

This is a best case: a warm local server and a fast connection to Prismic. Production on Vercel added serverless cold starts on top, and the cache headers above meant no request could be answered from the CDN.

## Notes

- The Prismic content measured is the repository's current master ref (last published 2022-10). It may differ slightly from what was live in March 2022.
- I also ran Lighthouse on the 2022-05-18 Wayback capture (`if_` mode, no toolbar). The 2022 capture was steady (11.8–12.2 s LCP), but a 2026 capture of the current site ranged from 2.8 to 21.1 s across 3 runs, depending on how quickly the archive served the banner. Timings served through the archive measure the archive, so they are not used.
- Evidence: `git show 85ff22c:package.json`, `curl -sI "https://web.archive.org/web/20220518224710id_/https://www.unleashedpotentiallifecoaching.com/"` (archived headers appear as `x-archive-orig-*`), and the build output and Lighthouse JSON from the scratch worktree (not committed).
