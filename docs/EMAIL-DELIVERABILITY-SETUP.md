# Setup: email deliverability (SPF, DKIM, DMARC)

Design: [CONTACT-FORM-DESIGN.md](CONTACT-FORM-DESIGN.md), decision 4
Written: 2026-10-17
Time: about 30 minutes, plus up to 1 hour for DNS to update

## Purpose

These steps make Gmail trust the form emails. Then the emails go to the inbox, not to spam.

The form emails come from `noreply@unleashedpotentiallifecoaching.com`. SendGrid sends them.

| Record | What it does                                                                       |
| ------ | ---------------------------------------------------------------------------------- |
| SPF    | It shows that SendGrid can send email for the domain.                              |
| DKIM   | It shows that the domain signed the email. It shows that nobody changed the email. |
| DMARC  | It tells Gmail what to do when SPF or DKIM fails. It sends reports to us.          |

## Current status (DNS check, 2026-10-17)

Domain `unleashedpotentiallifecoaching.com`:

- The SendGrid record `em1885` is missing. SPF cannot pass.
- The records `s1._domainkey` and `s2._domainkey` are proxied. DKIM cannot pass.
- There is no DMARC record.

Domain `jessrebelo.com`:

- This domain does not send email.
- There is no SPF record and no DMARC record. Other people can send fake email with this domain name.

## Before you start

1. Sign in to Cloudflare with `tumultywebservices@gmail.com`.
2. Sign in to SendGrid in a second browser tab.
3. Do not delete DNS records in these steps. Only change or add records.

## Part 1. Get the correct records from SendGrid

1. In SendGrid, go to **Settings → Sender Authentication**.
2. Find **Domain Authentication**.
3. Find the row for `unleashedpotentiallifecoaching.com`.
4. Open the row. SendGrid shows a table of DNS records.
5. Find the 3 records of type **CNAME**. Their names start with these words:
   - `em` (for example, `em1885`)
   - `s1._domainkey`
   - `s2._domainkey`
6. Copy the **Host** and the **Value** of each record into a note.

Note: SendGrid shows the host with the full domain, for example `em1885.unleashedpotentiallifecoaching.com`. In Cloudflare, type only the first part, for example `em1885`.

Note: If the row is not in SendGrid, stop. The domain must be authenticated again. That procedure is different.

## Part 2. Fix the DKIM records in Cloudflare

1. In Cloudflare, select the domain `unleashedpotentiallifecoaching.com`.
2. Go to **DNS → Records**.
3. Find the record `s1._domainkey`.
4. Click **Edit**.
5. Compare the target with the value from Part 1. If the value is different, type the value from Part 1.
6. Set **Proxy status** to **DNS only**. The cloud icon becomes grey.
7. Click **Save**.
8. Do steps 3 to 7 again for the record `s2._domainkey`.

Result: Both `_domainkey` records show a grey cloud.

## Part 3. Add the SPF record (return path) in Cloudflare

1. In **DNS → Records**, click **Add record**.
2. Set **Type** to **CNAME**.
3. In **Name**, type the first part of the `em` host from Part 1 (for example, `em1885`).
4. In **Target**, paste the `em` value from Part 1.
5. Set **Proxy status** to **DNS only**.
6. Click **Save**.

Result: The `em` record shows a grey cloud.

Note: SendGrid adds its SPF rule through this record. Do not add a separate SPF record for SendGrid at the root of the domain.

## Part 4. Verify in SendGrid

1. Wait 10 minutes.
2. In SendGrid, go to **Settings → Sender Authentication**.
3. Open the row for `unleashedpotentiallifecoaching.com`.
4. Click **Verify**.
5. Make sure that all 3 records show a green check.

If a record does not show a green check:

1. Wait 30 minutes more.
2. Click **Verify** again.
3. If it still fails, compare the Cloudflare record with the SendGrid value letter by letter.
4. Make sure that the cloud icon is grey.

## Part 5. Add DMARC to the sending domain

Start with `p=none`. This setting only collects reports. It does not block email. Use it to make sure that all real email passes first.

1. In Cloudflare, select the domain `unleashedpotentiallifecoaching.com`.
2. Go to **DNS → Records**.
3. Click **Add record**.
4. Set **Type** to **TXT**.
5. In **Name**, type `_dmarc`.
6. In **Content**, type this text:

   ```
   v=DMARC1; p=none; rua=mailto:tumultywebservices@gmail.com
   ```

7. Click **Save**.

Note: The reports come as email attachments (XML files), about 1 time each day for each mail provider. Gmail filters can move them to a label. Optional: Cloudflare has a free **DMARC Management** page (domain → **Email → DMARC Management**). It reads the reports for you and shows them as a table. If you turn it on, Cloudflare changes the `rua` address. Keep the address that Cloudflare sets.

## Part 6. Lock the domain that does not send email

The domain `jessrebelo.com` does not send email. These 2 records tell all mail providers to reject email that claims to come from it.

1. In Cloudflare, select the domain `jessrebelo.com`.
2. Go to **DNS → Records**.
3. Make sure that there is no **MX** record. If there is an MX record, stop. The domain receives email. Ask before you continue.
4. Click **Add record**.
5. Set **Type** to **TXT**, **Name** to `@`, and **Content** to:

   ```
   v=spf1 -all
   ```

6. Click **Save**.
7. Click **Add record** again.
8. Set **Type** to **TXT**, **Name** to `_dmarc`, and **Content** to:

   ```
   v=DMARC1; p=reject;
   ```

9. Click **Save**.

## Part 7. Test

1. Go to `https://jessrebelo.com`.
2. Send 1 message from the contact form. Put the word `TEST` in the message.
3. Sign in to the site's Gmail account.
4. Open the `TEST` email.
5. Click the **⋮** (More) icon. Click **Show original**.
6. Find the 3 lines at the top: **SPF**, **DKIM** and **DMARC**.
7. Make sure that all 3 lines say **PASS**.
8. Do steps 2 to 7 again for the review form and the book-time form.

If a line says **FAIL**:

| Line  | Do this                                                       |
| ----- | ------------------------------------------------------------- |
| SPF   | Do Part 3 again. Check the `em` record.                       |
| DKIM  | Do Part 2 again. Check that the cloud icon is grey.           |
| DMARC | Fix SPF and DKIM first. DMARC passes when one of them passes. |

## Part 8. Record the change

1. Open [CASE-STUDY.md](CASE-STUDY.md).
2. Add 1 row to the **Change log** table:

   | Date       | Change                                    | Expected effect             |
   | ---------- | ----------------------------------------- | --------------------------- |
   | 10/17/2026 | SPF, DKIM, DMARC fixed after the DNS move | Fewer real requests in spam |

3. Add a comment on Linear issue TWS-37 with the test result.

## Part 9. Later (2 to 4 weeks after Part 5)

1. Read the DMARC reports.
2. Make sure that all email from SendGrid passes.
3. Change the DMARC record on `unleashedpotentiallifecoaching.com` from `p=none` to `p=quarantine`.
4. Do the test in Part 7 again.

## Checklist

- [ ] `s1._domainkey` and `s2._domainkey`: DNS only (grey cloud)
- [ ] `em…` CNAME added: DNS only (grey cloud)
- [ ] SendGrid: domain verified, 3 green checks
- [ ] `_dmarc` on `unleashedpotentiallifecoaching.com`: `p=none`
- [ ] `jessrebelo.com`: SPF `-all` and DMARC `p=reject`
- [ ] 3 test emails (1 for each form): SPF, DKIM, DMARC all PASS
- [ ] Change log row added
- [ ] Reminder set: move DMARC to `p=quarantine` in 2 to 4 weeks
