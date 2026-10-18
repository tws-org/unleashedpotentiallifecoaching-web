# Case study: contact form requests (draft)

Status: skeleton. Written in Peter's own voice after the fix ships and the "after" numbers are in.
Sources: [CONTACT-FORM-BASELINE.md](CONTACT-FORM-BASELINE.md) (before), results doc (after, TBD)
Sign-off: Jess approves the wording before it is published

Rule: outcomes first. Lead with what changed for Jess, with the number.

## Measurement rules (set before any change)

- **Outcome:** good requests a month in the Gmail inbox. Target: **2 a month by 2026-12-01**. Stretch goal: 5 a month. (Changed from 5 on 2026-10-16, after the baseline showed 0.)
- **Good request:** a real person, with a way to reach them, asking for therapy or behavioral health. Use the saved examples to decide close calls.
- **Counting:** by the date received. One person who writes twice counts once. **Test submissions don't count:** every test message includes the word `TEST` in the message.
- **Leading signal:** form submits (GA `generate_lead`, after the pipeline ships). Submit numbers start on the ship date, so there is no "before" for them.
- **Guardrails:** spam that reaches the inbox stays near 0. Blocked submissions are logged and checked weekly, so the spam filter doesn't block real people.
- **Comparison:** count Psychology Today inquiries each month too. If both go up, something outside the site may be the cause.
- **Change log:** record the date of each change (pipeline, spam fix, each content update). Ship one change at a time where possible, so each result has a clear cause.
- **Small numbers:** 4 in 2 months is a small base. Report raw counts, not percentages. Don't claim a cause from one month.
- **Before publishing:** Jess approves the numbers and wording. Raw data (exports, emails) stays private.

## Change log

| Date       | Change                                    | Expected effect             |
| ---------- | ----------------------------------------- | --------------------------- |
| 10/17/2026 | SPF, DKIM, DMARC fixed after the DNS move | Fewer real requests in spam |
| 10/17/2026 | Phase 1b: `/api/submit` pipeline. Each submission gets an ID (in the subject, SendGrid and a DynamoDB record), the server builds the email, GA `generate_lead` on confirmed sends. Same forms, same email | Submits and sends can be counted and traced by ID |
| 10/17/2026 | Phase 1c: spam protection on all 3 forms. Per-IP rate limit, honeypot, Turnstile. Blocked submits are recorded, not emailed | No spam in the inbox. Blocked count visible |

## Headline

<!-- One line: the outcome and the number. Example shape: "From X to Y good requests a month in Z weeks." -->

## Problem

<!-- What was broken, in her words. Before numbers from the baseline. -->

Notes to write from (facts, not final wording):

- Her questions: "Why did my requests drop off?" and "Why did I suddenly get more spam?"
- **Spam:** the forms had no spam protection (no honeypot, no CAPTCHA, no rate limit). Bots find unprotected forms over time. Likely cause of the spam increase (likely, not proven).
- **The drop:** traffic was flat over the 2 months of data (about 70 visitors a month), so people did not stop visiting. Analytics kept only 2 months of history, so when the drop started cannot be found.
- **Fit:** the site still said "life coaching," so it brought in life coaching requests. Her ideal clients (therapy, behavioral health) came from Psychology Today.
- **Nothing counted the requests.** No submit tracking in analytics. The email provider's counts (48 delivered) did not match the inbox (4). So the honest answer was: we can't say exactly why yet, because nothing was measuring it.
- Before: about 6 requests a month at the old level. From Aug 16 to Oct 16, 2026: 4 form emails in the inbox, 3 spam, 1 real, **0 good**. 2 of the 3 spam came through the review form.

## What I did

Notes to write from:

- Told her what we knew, what we couldn't know yet, and the plan, instead of guessing.
- Step one: trackers, so every request is counted from the form to the inbox (one ID per submission).
- Then: spam protection, then the content refresh toward therapy.

<!-- The steps, short. Funnel first, then the fixes. -->

## Result

<!-- After numbers, in bold. Link the results doc. -->

## What I'd do next

<!-- The content refresh, adding a therapist, keeping the site current. -->

## Links

- [Baseline](CONTACT-FORM-BASELINE.md)
- Results (TBD)
