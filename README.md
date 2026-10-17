# Unleashed Potential Life Coaching

Website for Jess Rebelo's online life coaching and trauma therapy practice.

**Live site:** [jessrebelo.com](https://jessrebelo.com/)

## Stack

- [Next.js 15](https://nextjs.org/) (Pages Router) with [React 19](https://react.dev/) and TypeScript
- [Contentful](https://www.contentful.com/) as the CMS, queried over GraphQL. Pages are statically generated with `getStaticProps`.
- [Tailwind CSS 3](https://tailwindcss.com/) and [styled-components](https://styled-components.com/)
- [TanStack Query 5](https://tanstack.com/query/latest) for client-side pagination on the blog, podcast and interview pages
- [Headless UI](https://headlessui.com/), [Framer Motion](https://motion.dev/), react-slick
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) forms, sent through [SendGrid](https://sendgrid.com/) by `pages/api/send-email.ts`
- Google Analytics via `@next/third-parties`

## Hosting

The site runs two ways from the same code:

| Target                                   | Build                                                         | Deploy                                   |
| ---------------------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| **Vercel** (serves jessrebelo.com today) | `next build`                                                  | Vercel Git integration on push to `main` |
| **Cloudflare Workers**                   | [vinext](https://github.com/cloudflare/vinext) (`vite build`) | GitHub Actions on push to `main`         |

The Cloudflare deploy is two Workers, configured in `cloudflare.config.ts` and `vite.config.ts`:

- `unleashedpotentiallifecoaching-web`: the app. Uses a Cloudflare Images binding for `next/image`.
- `unleashedpotentiallifecoaching-web-response-store`: the page/data cache, backed by R2 and a Durable Object. It deploys first, because the app binds to it.

## Getting started

Requires Node 22 and pnpm 10 (`corepack enable` picks up the version in `package.json`).

```sh
pnpm install
# create .env with the variables below
pnpm dev               # Next.js on http://localhost:3001
```

### Environment variables

| Variable                                                                | Used for                                                                                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_CONTENTFUL_GRAPHQL_API_URL`                                | Contentful GraphQL endpoint                                                                      |
| `NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN`                    | Read-only Contentful delivery token. Ships to the browser on purpose for client-side pagination. |
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`, `NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT` | Contentful space and environment                                                                 |
| `SENDGRID_API_KEY`, `TO_EMAIL_ADDRESS`                                  | Contact form email (server only)                                                                 |
| `CONTENTFUL_MANAGEMENT_TOKEN`                                           | `pnpm codegen` only. Never deploy it.                                                            |
| `CLOUDFLARE_API_TOKEN`                                                  | Local Cloudflare deploys only                                                                    |

On Cloudflare, `SENDGRID_API_KEY` and `TO_EMAIL_ADDRESS` are encrypted secrets on the app Worker. CI reads the `NEXT_PUBLIC_*` values and the Cloudflare credentials from GitHub Actions secrets.

## Scripts

| Script                                   | What it does                                                          |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev server, production build, production server               |
| `pnpm lint`                              | `next lint`, then Prettier                                            |
| `pnpm codegen`                           | Regenerates `types/contentful.d.ts` from the Contentful content model |
| `pnpm dev:vinext` / `pnpm build:vinext`  | vinext dev server and production build                                |
| `pnpm deploy:response-store`             | Deploys the cache Worker from an existing `pnpm build:vinext` output  |
| `pnpm deploy:vinext`                     | Builds and deploys the app Worker, warming the cache                  |

## CI/CD

`.github/workflows/deploy.yml` runs `pnpm build` and `pnpm build:vinext` on every pull request and push. On `main` it then deploys the response-store Worker, then the app Worker.

## Docs

Project write-ups live in [`docs/`](docs/):

- [Baseline](docs/BASELINE.md) and [migration results](docs/MIGRATION-RESULTS.md): the move from Prismic + server rendering to Contentful + static generation
- [Contact form baseline](docs/CONTACT-FORM-BASELINE.md), [design](docs/CONTACT-FORM-DESIGN.md) and [case study](docs/CASE-STUDY.md)
