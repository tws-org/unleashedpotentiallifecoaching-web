# Learnings: contact form pipeline (phase 1)

Design: [CONTACT-FORM-DESIGN.md](CONTACT-FORM-DESIGN.md)
Case study: [CASE-STUDY.md](CASE-STUDY.md)
Recorded: 2026-10-17

This file records what Peter learned in phase 1b (tracking pipeline) and phase 1c (spam protection). Each entry is short. The code is the reference.

Do not put secrets, account IDs, ARNs or personal data in this file. The repo is public.

## Phase 1b: the `/api/submit` pipeline

Code: `app/api/submit/route.ts` and `lib/submission/`.

The route does these steps in this order:

1. It validates the fields.
2. It writes the record to DynamoDB.
3. It builds the email and sends it.
4. It marks the record `sent` or `failed`.

### Teachback, 2026-10-17

**1. Why the server builds the email**

Before, the browser sent ready-made HTML to `/api/send-email`. Anyone could post any email body. Now the browser sends only the raw fields. The server validates the fields with the shared Yup schemas. Then it escapes each value with `escapeHtml`.

Rule: do not trust data from the browser.

**2. Why DynamoDB values have type wrappers**

Examples of type wrappers: `{ S: ... }`, `{ N: ... }`, `{ BOOL: ... }`.

The DynamoDB API uses plain JSON. Plain JSON cannot show the difference between a number, a string set and binary data. So each value must state its type. DynamoDB numbers go as strings, for example `{ N: "1792152000" }`.

Yup checks the data from the user. The wrappers are only for DynamoDB.

**3. `attribute_not_exists(pk)` and `attribute_exists(pk)`**

- On `PutItem`, `attribute_not_exists(pk)` prevents an overwrite. A new record cannot replace a record with the same key.
- On `UpdateItem`, `attribute_exists(pk)` prevents a half record. If the record does not exist, the update fails. It does not create a new record.

**4. Fail open**

If DynamoDB fails, the email still goes to Jess. A lost record only changes the counts. A lost email can lose a client.

How the code does this: the route awaits each DynamoDB call inside its own `try/catch`.

The bug: `putSubmission` did not return its promise, and the route did not await it. The error occurred after the `try/catch` was complete. So no code caught the error. A Vitest test found the bug. Vitest showed an "unhandled rejection".

**5. Why `formType` is `unknown`**

`request.json()` returns `any`. A type guard cannot narrow `any`.

The code declares `const formType: unknown = body?.formType`. Then TypeScript requires the `isFormType` check at runtime. After the check, TypeScript knows that the value is a real `FormType`.

A `@ts-ignore` comment hid this problem. At runtime, the route would crash.

**6. One submission ID in all systems**

The same ID is in 3 locations:

- The email subject: `[id]`.
- SendGrid: `custom_args.submission_id`.
- DynamoDB: `pk = sub#<id>`.

With this ID, you can follow 1 TEST from the form to the inbox.

**7. Why `generate_lead` fires after the server answers**

GA must count only real leads. If the event fires on the click, GA also counts failed submits. Then the numbers for Jess are too high.

**8. How we found the secret typos**

Cloudflare does not show the values of Worker secrets. `wrangler tail` shows the live logs of the Worker. The `catch` blocks log the full error. AWS error messages show the incorrect value.

The logs showed 2 typos:

- The table name had an extra `)`.
- The region was `us-east-1`. The correct region is `us-east-2`.

### Other lessons from 1b

- **Arrow functions:** without `{ }`, an arrow function returns its expression. With `{ }`, you must write `return`. If you do not, the caller gets `undefined`.
- **Warning signs:** `@ts-ignore` and `as unknown as X` show that the types do not match. Find the cause. Do not hide the error.
- **Do not widen a type to hide a bug.** Example: adding `'spamResult'` to a union type made an incorrect value compile.
- **Quotes:** `spamResult: 'spamResult'` stores the text "spamResult". `spamResult,` stores the value of the variable.
- **`vi.fn` types:** Vitest gets the argument types from the function that you give it. `vi.fn(async () => ...)` has 0 arguments. So `mock.calls[0][0]` is a type error. Fix: give the mock a typed parameter, for example `vi.fn(async (_request: Request) => ...)`.
- **Vitest config:** Vitest needs its own `vitest.config.ts`. The default `vite.config.ts` loads vinext, and the tests fail.
- **App Router on vinext and Cloudflare:** install `@vitejs/plugin-rsc`. Add `viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] }` to the Cloudflare plugin.
- **Worker secrets:** set them with `printf`. Do not type or paste them at the prompt. Example: `printf 'value' | npx wrangler secret put NAME --name <worker>`. You can see each character, and there is no newline.
- **AWS sign-in:** an IAM Identity Center user signs in only at the AWS access portal URL (`....awsapps.com/start`). The normal AWS sign-in page does not work for this user.
- **AWS console access:** in the portal, select the account, then the permission set, then **Management console**. Then make sure that the region is correct.

## Phase 1c: spam protection

Code:

- `lib/submission/rate-limit.ts`
- `features/forms/HoneyPot.tsx`
- `features/forms/Turnstile.tsx`
- `lib/submission/turnstile.ts`
- `features/forms/SubmitButton.tsx`

There are 3 layers. The least expensive layer runs first.

All spam checks run before validation. Validation uses `stripUnknown: true`, which removes the `website` and `turnstileToken` fields.

| Layer | What it does | Result when it blocks |
| -- | -- | -- |
| Rate limit | It allows 3 submits for each IP address in 1 minute. It uses the Cloudflare rate-limit binding. It runs first, before all AWS calls. | 429. No record, so a flood does not cause thousands of DynamoDB writes. |
| Honeypot | It adds a `website` field that people cannot see. Bots read the HTML and fill the field. | A fake 200, so the bot gets no information. The record shows `blocked`. |
| Turnstile | Cloudflare checks that a person uses the page. It gives the browser a token that works 1 time. The server verifies the token. | 403. A real person can fail the check, so the person must be able to try again. The record shows `blocked`. |

### Honeypot

- The field is off-screen, with `aria-hidden` and `tabIndex={-1}`. Screen readers and keyboard users do not go into it.
- The field does not use `display: none`. Some bots skip hidden inputs.
- Each form needs a unique `id` (`idPrefix`). The contact form is on every page, so 2 forms can be on 1 page.

### Turnstile

- **2 keys:**
  - The site key is public. It goes into the browser code at build time (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
  - The secret key is private. It stays on the Worker (`TURNSTILE_SECRET_KEY`).
- **Tokens:** a token works 1 time. The widget renders again after each submit (`submitCount`).
- **Hostnames:** the widget runs only on the hostnames in the Cloudflare dashboard. If a hostname is missing, the widget shows a "Troubleshoot" error. Then all real visitors are blocked.
- **Mode:** Managed mode can show a checkbox, often to testers. Non-interactive mode does not show a checkbox.
- **Submit button:** `SubmitButton` stays disabled and shows "Verifying…" until the token arrives. So nobody can submit too early and get a 403.
- **Logs:** when `verifyTurnstile` blocks, it logs the Cloudflare `error-codes`. `wrangler tail` then shows the cause in 1 request.

### Rate limit

- The limit applies to 1 IP address. It stops a flood from 1 source.
- A DDoS attack comes from thousands of IP addresses. Cloudflare's network DDoS protection stops that type of attack.
- `cf-connecting-ip` is the real IP address of the visitor. Cloudflare sets this header.
- **Bindings:** a binding is a resource that Cloudflare gives the Worker at runtime. You declare it in `cloudflare.config.ts`. App code reads it with `import { env } from 'cloudflare:workers'`. The types go in `types/cloudflare-workers.d.ts`.

### Fail open in 1c

- If the Turnstile verify call gets no answer, the result is `unchecked`. The email still goes out.
- If the rate limiter fails, Turnstile still protects the form.

**Summary:** the honeypot stops simple bots at no cost. Turnstile stops smarter bots. The rate limit stops floods before they cost money.

## Deploys

- When you merge a PR to `main`, CI deploys the site to Cloudflare (`.github/workflows/ci.yml`).
- For a PR, CI only runs the checks: `tsc`, `pnpm test` and `pnpm build:vinext`.
- The build reads `NEXT_PUBLIC_*` values. So CI needs them as repository secrets. If a value is missing, the build makes a page that does not work.
- `pnpm deploy:vinext` is the manual fallback.
