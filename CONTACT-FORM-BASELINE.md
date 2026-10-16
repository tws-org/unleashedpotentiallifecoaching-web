# Baseline: contact form requests (before the fix)

Source: discovery call with Jess, 2026-10-16
Goal: 5 good client requests a month from the site by 2026-12-01
Recorded: 2026-10-16 (numbers to fill in below)

This is the "before" for the contact form work. The "after" goes in a results doc when the fixes ship, the same way [BASELINE.md](BASELINE.md) and [MIGRATION-RESULTS.md](MIGRATION-RESULTS.md) work for the migration.

## Problem

- The website forms used to bring about **6 clients a month**. That has stopped.
- Spam is up.
- Real requests are down.
- Most requests that come in are for life coaching. Jess wants therapy and behavioral health clients.
- Psychology Today brings the clients she wants. The site does not.

The forms deliver: a test message on 2026-10-16 arrived in her inbox. So this is not a delivery bug. The question is where in the funnel the requests are lost.

## Goal and measure

| | Value | Source |
| -- | -- | -- |
| Outcome | 5 good requests a month by 2026-12-01 | Agreed on the call |
| Good request | A real person asking for therapy or behavioral health | Request examples (private) |
| Old level | About 6 a month (months: TBD) | Jess. Confirm with the inbox |
| Current level | **4 form emails in 2 months** (2026-08-16 to 2026-10-16), about 2 a month. Real / good split: TBD | Gmail inbox (the primary metric) |
| Drop started | TBD | Analytics and inbox, month by month |

## Funnel

Each step has a number. The step where the number falls shows the cause.

| Step | What | Source | Status |
| -- | -- | -- | -- |
| 1 | Visitors | Google Analytics | TBD |
| 2 | Views of pages with a form (home footer, book time) | Google Analytics | TBD |
| 3 | Form submits | Not tracked (no analytics event on submit) | Add an event |
| 4 | Emails sent | Vercel function logs for `/api/send-email`, SendGrid activity | TBD |
| 5 | Real requests (spam removed) | Inbox | Blocked: inbox access |
| 6 | Good requests (therapy, not life coaching) | Inbox | Blocked: inbox access |

## Monthly numbers

GA keeps only 2 months of data here, so the history starts 2026-08-16. Vercel keeps 24 hours of logs, so it has no history. The contact form is in the footer of every page, so GA page views are all page views.

| Month | Users (GA) | Sessions (GA) | Views (GA) | Form events (GA) | Email requests (SendGrid) | Delivered (SendGrid) | Real requests | Good requests |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| Aug 2026 (16–31) | 50 | 60 | 115 | 8 | 11 | 11 | TBD | TBD |
| Sep 2026 | 71 | 81 | 104 | 0 | 14 | 14 | TBD | TBD |
| Oct 2026 (1–16) | 34 | 35 | 48 | 2 | 23 | 23 | TBD | TBD |
| **Total** | **152** | **176** | **267** | **10** | **48** | **48** | | |

Sources: GA free-form exploration and form events export, 2026-08-16 to 2026-10-16. SendGrid Statistics Overview, monthly, same range (monthly values read from the chart; the 48 total is exact). SendGrid shows 0 bounces, 0 blocks and 0 spam reports.

Form events by country (GA): US 6, Iran 2, Germany 1, Netherlands 1.

### First read (2026-10-16)

- **SendGrid sent 48 emails. GA saw 10 form events.** In September, 14 emails went out with 0 form events. In the first half of October, 23 emails went out with 2 form events. Most emails are sent without anyone using the form in a browser. This supports H1 (bots post to the endpoint directly).
- **Traffic did not fall in this window.** About 70 users a month. This does not support H2 for these 2 months. The drop to below 6 a month may be older than the 2 months of GA data.
- **Emails are going up while form use goes down.** October is on pace for about 45 emails.
- Caveats: ad blockers hide some real visitors from GA. The review and book-time forms use the same endpoint. The GA event is `form_start` (first interaction with a form), not a submit; GA records no `form_submit`. So the 10 is the most submits there could have been from a browser.

### Inbox check (2026-10-16)

- **SendGrid delivered 48 emails. The inbox shows 4** for 2026-08-16 to 2026-10-16. 44 are not in the inbox.
- All form emails go to the site's Gmail account. SPF passes, through SendGrid domain authentication (`em1885` subdomain). So sender setup is not the reason they are missing.
- Not in the spam folder (checked 2026-10-16). The SendGrid numbers do not match the inbox, and the cause is not known.
- Domain test (2026-10-16): a marked test from each domain (jessrebelo.com and unleashedpotentiallifecoaching.com) landed in the inbox. Both domains serve the same production app with no redirects. `TO_EMAIL_ADDRESS` is the site's Gmail account. So the domain and the env setting are not the cause.
- Gmail settings (2026-10-16): no filters, no blocked addresses, POP off.
- **Decision (2026-10-16): the Gmail inbox is the primary metric.** SendGrid counts are kept above for reference only, not as a measure.
- Request examples saved locally for reference (`*.eml`, never committed): 1 very good (Jun 2026), 2 good (May and Aug 2024), 1 neutral (Jun 2024), 2 spam (Dec 2024, and Sep 2026 through the **review** form). The review form is also a spam path.

## Hypotheses

| # | Hypothesis | What would prove it |
| -- | -- | -- |
| H1 | Bots send spam through the forms, and the spam buries the real requests | Email calls (step 4) are much higher than form page views (step 2) |
| H2 | Fewer people visit the site | Visitors fall in the same months as requests |
| H3 | The site says "life coaching," so it attracts life coaching requests | Most real requests ask for coaching, few ask for therapy |
| H4 | Real requests land in spam, or nobody reads them | Real requests found in the spam folder |
| H5 | Psychology Today now brings the clients the site used to bring | Psychology Today inquiries rose as site requests fell |

H1 and H4 are fixes in the code and the inbox. H2, H3 and H5 point to the content refresh.

## Checks

| Check | Result |
| -- | -- |
| Forms deliver | Yes. Test message arrived 2026-10-16 |
| Spam protection on the forms | None: no honeypot, no CAPTCHA, no rate limit (contact, review and book-time forms) |
| Form submits in analytics | Not tracked. GA records page views only |
| Security review of the email endpoint | Done 2026-10-16. Details kept private until fixed |

## Open questions (parked 2026-10-16)

- **Why does SendGrid count 48 delivered emails when the inbox has 4?** Ruled out: spam folder, domain (both domains tested), `TO_EMAIL_ADDRESS`, Gmail filters, blocked addresses, POP. Not checked: Gmail account access log ("Details") and Activity Feed event details. Parked: the inbox is the metric, and the new pipeline below makes every submission traceable.

## Requirement for the fix: one traceable email pipeline

Every submission must be countable at each step, so the numbers match from form to inbox.

1. **One ID per submission.** The server gives each submission an ID and a form type (contact, review, book time).
2. **The server builds the email,** from validated fields. The browser sends only the fields.
3. **Spam check before sending** (honeypot, CAPTCHA, rate limit). Record the result: sent or blocked.
4. **A record of each submission:** ID, form type, time, spam result, SendGrid message ID.
5. **SendGrid tags:** a category per form type and the submission ID as a custom argument, so SendGrid stats split by form and each email matches its record.
6. **GA event on success:** `generate_lead` with the form type. GA then shows submits, not only `form_start`.
7. **The ID in the email subject or footer,** so an inbox email can be matched to its record.

Done when one test submission per form can be followed by its ID through the record, SendGrid, GA and the inbox.

## Data to collect

- [ ] Inbox access works (password manager set up)
- [ ] Request examples: one bad, one neutral, one good (kept private, never in this repo)
- [ ] Monthly numbers table above
- [ ] The month the drop started, matched against site changes (`git log`) and traffic changes
