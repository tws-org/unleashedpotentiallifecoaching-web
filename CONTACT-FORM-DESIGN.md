# Design: contact form pipeline

Status: draft (decisions marked **Decide** are open)
Baseline: [CONTACT-FORM-BASELINE.md](CONTACT-FORM-BASELINE.md)
Case study: [CASE-STUDY.md](CASE-STUDY.md)
Recorded: 2026-10-16

## Goal

2 good client requests a month in the inbox by 2026-12-01 (stretch goal: 5). Baseline, 2026-08-16 to 2026-10-16: 0 good, 1 real, 3 spam.

This design covers the forms and the email pipeline. The content refresh toward therapy is phase 4 and gets its own doc.

## Current state

- 3 forms: contact (footer of every page), review, and book time. All use Formik and Yup in the browser.
- All 3 post to one endpoint, `/api/send-email`, which sends through SendGrid to the site's Gmail account.
- No spam protection on any form. 2 of the 3 spam emails in the baseline came through the review form.
- No submit tracking. GA records `form_start` only.
- No record of submissions. The only copy is the email. SendGrid counts do not match the inbox (48 vs 4), and the cause is not known.
- Stack: Next.js 15 (Pages Router), Contentful, SendGrid, Google Analytics. Hosting moves from Vercel to Cloudflare Workers before phase 1. New: AWS DynamoDB for submission records.

## Requirements

**Functional**

1. Each submission gets an ID and a form type (`contact`, `review`, `booking`).
2. The server checks every field. It does not trust anything the browser sends.
3. The server builds the email from the checked fields. User input is escaped.
4. Spam is blocked before the email is sent. A blocked submission is recorded, not dropped silently.
5. Each submission is recorded: ID, form type, time, spam result, SendGrid message ID, and whether it is a test.
6. SendGrid tags each email with its form type (category) and its ID (custom argument).
7. The ID appears in the email subject, so an inbox email matches its record.
8. On success, the browser sends a GA `generate_lead` event with the form type.
9. Messages that contain `TEST` are marked as tests and left out of the counts.

**Non-functional**

- **Privacy:** store only what the email already contains. No data in the browser's storage. Records older than 12 months are deleted. (Decide: retention period.)
- **Cost:** free tiers only. Pro bono project.
- **Simple to run:** Jess must not need to log in anywhere new to get her requests. They still arrive in Gmail.
- **Measurable:** one test per form can be followed by its ID from the form to the inbox.

**Not in scope**

- A CRM, an inbox replacement, or a new email provider.
- The content refresh (phase 4).

## Design

```
Browser form
  -> honeypot field + Turnstile token
  -> POST /api/submit { formType, fields, token }
Server
  1. Validate fields (one shared schema per form type)
  2. Check honeypot, Turnstile token, rate limit
  3. Create ID; write record (status: blocked | sent | failed)
  4. Build email on the server (escaped), subject includes ID
  5. Send through SendGrid (category = formType, custom_args = { submission_id })
  6. Update record with SendGrid message ID
  7. Return { ok, id }
Browser
  -> on ok: GA generate_lead { form_type }
```

A new endpoint (`/api/submit`) replaces `/api/send-email`. The old endpoint is removed in the same release, so the old path can't be used to bypass the checks.

## Options and decisions

### 1. Where the submission record lives

| Option | Pros | Cons |
| -- | -- | -- |
| A. Postgres from the Vercel Marketplace (for example Neon) | Durable, easy to query and count, one small table | One more service to manage |
| B. Google Sheet through the Sheets API | Jess can see it without a new tool | Rate limits, a service account to manage, harder to query |
| C. No database: SendGrid tags + GA + the ID in the email | Nothing new | SendGrid counts are already not trusted, and blocked spam leaves no trace |
| D. AWS DynamoDB | Serverless, no server to run. TTL deletes old records automatically. The same table can hold rate-limit counters. AWS experience | AWS account and IAM setup; queries are by key, so monthly counts need a scan or an index |

**Decision (2026-10-16): D, AWS DynamoDB.**

- **Audience:** engineering only. Jess gets a monthly summary (counts by form, spam blocked, good requests) from Peter. Her requests still arrive in Gmail.
- **Metadata only:** ID, form type, time, spam result, "looking for" choice, SendGrid message ID, test flag. No names, no contact details, no message text. Visitors may write about mental health, so the email stays the only copy of personal content.
- **Retention:** a TTL attribute deletes each record after 12 months.
- **Access from the site (updated 2026-10-16):** the site moves to Cloudflare Workers before phase 1, so Vercel OIDC is not used. An IAM user limited to this one table (`PutItem`, `UpdateItem`, `GetItem`), no console access. Its keys are Worker secrets, rotated every 90 days. Client: `aws4fetch`.
- **Where the endpoint runs:** `/api/submit` stays inside the Next.js app on the Worker. Turnstile and the honeypot run before any AWS call, and Cloudflare's request limit caps a bot flood before it reaches AWS.
- **Cost:** stay inside the free tier (to confirm current limits: provisioned capacity is free up to a set amount; on-demand is billed per request, which is cents at this volume).
- **Billing: strict, $4 a month maximum (Peter, 2026-10-16). No unexpected bills.**
  - AWS has no hard spending cap on a normal account. Budgets alert; they do not stop charges by themselves. So the cap is built from 3 layers:
  1. **Design cap:** provisioned capacity at a fixed low level, inside the free tier, with auto scaling **off**. Extra traffic is throttled, not billed.
  2. **AWS Budget, $4 a month:** email alerts at 50%, 80% and 100% of actual cost, and at 100% of forecast cost.
  3. **Budget action at 100%:** attach a deny policy to the app's IAM role, so nothing in this account can keep running up cost.
  - **Fail open:** if the DynamoDB write fails (throttled or denied), the email still goes to Jess. Losing a record is acceptable; losing a client request is not.
  - Only this table, its notification path (stream, one Lambda, one SNS topic) and the budget in this account. No other paid services without a new decision.
  - Account plan: Paid plan with the caps above. The Free plan closes the account after 6 months.
- **Account (decided 2026-10-16):** Peter's business account (`tumultywebservices@gmail.com`). Peter manages all client tools from one login.
- **Notification (2026-10-16):** Peter gets an email for each new submission record: DynamoDB stream → Lambda (new `sub#` items only, concurrency 1) → SNS email. Metadata only.

### 2. Spam protection

| Layer | What it stops | Cost to real visitors |
| -- | -- | -- |
| Honeypot (hidden field) | Simple bots | None |
| Cloudflare Turnstile | Most bots, including ones that post straight to the endpoint | Usually none; sometimes a short check |
| Rate limit per IP | Floods | None at normal use |
| Server-side validation | Junk and malformed posts | None |

Suggestion: **all 4.** Turnstile is in the same Cloudflare account as the site and has a free tier (to confirm the current limits). The rate limit needs a small store; it uses the same DynamoDB table (counters with a short TTL). **Decide.**

### 3. "What are you looking for?" field

A required choice on the contact and book-time forms: Therapy, Behavioral health, Life coaching, Other.

- Pros: measures fit at the source, so "good request" is counted by the form and not only by reading emails. Visitors see that she offers therapy.
- Cons: one more field. It also changes the form, so ship it as its own step in the change log.

Suggestion: **yes, in phase 3.** **Decide** with Jess (the choices and their wording).

## Rollout (one change at a time, logged in the case study change log)

| Phase | Change | Measures |
| -- | -- | -- |
| 1 | Pipeline and tracking: IDs, record, SendGrid tags, GA `generate_lead`. Same forms, same email | Submits and sends can now be counted |
| 2 | Spam protection on all 3 forms (review form first if split) | Spam in the inbox, blocked count |
| 3 | "What are you looking for?" field | Share of therapy requests |
| 4 | Content refresh toward therapy (own doc) | Good requests a month |

Leave at least 1 week between phases where the timeline allows.

## Testing

- Unit tests for each form schema and for email building (escaping).
- One end-to-end test per form, with `TEST` in the message: follow the ID through the record, SendGrid, GA and the inbox.
- A bot test: a direct POST with no Turnstile token is blocked and recorded.

## Risks

- Turnstile blocks a real person. Mitigation: blocked submissions are recorded and checked weekly (case study guardrail).
- The 48 vs 4 mismatch is still not explained. The record and the ID in the subject make the next mismatch traceable.
- Small numbers: one good request changes the result a lot. Report raw counts.
