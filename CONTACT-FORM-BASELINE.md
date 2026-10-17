# Baseline: contact form requests (before the fix)

Source: discovery call with Jess, 2026-10-16
Goal: 2 good client requests a month from the site by 2026-12-01 (stretch goal: 5)
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
| Outcome | **2 good requests a month by 2026-12-01.** Stretch goal: 5 | 5 agreed on the call; changed to 2 (stretch 5) on 2026-10-16 after the baseline showed 0. Confirm with Jess |
| Good request | A real person asking for therapy or behavioral health | Request examples (private) |
| Old level | About 6 a month (months: TBD) | Jess. Confirm with the inbox |
| Current level | **0 good requests in 2 months** (2026-08-16 to 2026-10-16). 4 form emails: 3 spam, 1 real (not good) | Gmail inbox (the primary metric), sorted 2026-10-16 |
| Drop started | TBD | Analytics and inbox, month by month |

## Funnel

Each step has a number. The step where the number falls shows the cause. Period: 2026-08-16 to 2026-10-16 (the 2 months GA kept).

| Step | What | Number | Source | Trust |
| -- | -- | -- | -- | -- |
| 1 | Visitors | 152 users, 176 sessions | Google Analytics | Good. Ad blockers hide some visitors |
| 2 | Views of pages with a form | 267 views | Google Analytics | The contact form is in the footer of every page, so this is all page views |
| 3 | Form starts | 10 (`form_start`) | Google Analytics | Good. Counts a first interaction, not a submit |
| 4 | Form submits | Not tracked | None | **Gap.** No submit event. Add `generate_lead` |
| 5 | Emails sent | 48 requests, 48 delivered | SendGrid | **Not trusted.** Does not match the inbox (see Open questions). Vercel logs keep only 24 hours |
| 6 | Emails in the inbox | **4** | Gmail inbox | **The primary metric** |
| 7 | Real requests (spam removed) | **1** (book time, Aug 23) | Gmail inbox | Sorted 2026-10-16 |
| 8 | Good requests (therapy, not life coaching) | **0** | Gmail inbox | Sorted 2026-10-16 |

What it shows: about 7% of visitors start a form (10 of 152), and the funnel has no trusted count between "form start" and "inbox." Steps 4 and 5 are what the new pipeline fixes.

## Monthly numbers

GA keeps only 2 months of data here, so the history starts 2026-08-16. Vercel keeps 24 hours of logs, so it has no history. The contact form is in the footer of every page, so GA page views are all page views.

| Month | Users (GA) | Sessions (GA) | Views (GA) | Form events (GA) | Email requests (SendGrid) | Delivered (SendGrid) | Real requests | Good requests |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| Aug 2026 (16–31) | 50 | 60 | 115 | 8 | 11 | 11 | 1 | 0 |
| Sep 2026 | 71 | 81 | 104 | 0 | 14 | 14 | 0 | 0 |
| Oct 2026 (1–16) | 34 | 35 | 48 | 2 | 23 | 23 | 0 | 0 |
| **Total** | **152** | **176** | **267** | **10** | **48** | **48** | **1** | **0** |

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
- **Inbox sort (2026-10-16, baseline frozen):** 4 form emails. Aug 16, review form, spam. Aug 23, book time, real, not good. Sep 17, review form, spam. Sep 17, contact form, spam. None were test messages. **2 of the 3 spam emails came through the review form.**
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
