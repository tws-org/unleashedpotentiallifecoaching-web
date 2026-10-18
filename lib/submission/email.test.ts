import { describe, expect, it } from 'vitest';
import { buildEmail, escapeHtml } from './email';

describe('escapeHtml', () => {
  it('turns HTML into plain text', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
  });

  it('prints nothing for a missing value', () => {
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('buildEmail', () => {
  const contact = {
    fullName: 'Pat <b>Bold</b>',
    email: 'pat@example.com',
    phone: '5555550100',
    message: 'Hello\nTEST',
  };

  it('puts the submission ID in the subject', () => {
    expect(buildEmail('contact', contact, 'abc').subject).toContain('[abc]');
  });

  it('escapes visitor input and includes the phone number', () => {
    const { html } = buildEmail('contact', contact, 'abc');
    expect(html).not.toContain('<b>Bold</b>');
    expect(html).toContain('Pat &lt;b&gt;Bold&lt;/b&gt;');
    expect(html).toContain('5555550100');
  });

  it('shows booking times in Eastern time', () => {
    const booking = {
      ...contact,
      comments: '',
      eventDate: new Date('2026-11-02T18:30:00Z'),
    };
    expect(buildEmail('booking', booking, 'abc').html).toContain('1:30 PM ET');
  });
});
