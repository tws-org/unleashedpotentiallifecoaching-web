import fetch from 'node-fetch';
const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';

interface Email {
  body: string;
  subject: string;
  type?: string;
}

const sendSeverEmail = async (contents: Email) => {
  const { subject, body } = contents;

  if (!process.env.SENDGRID_API_KEY) {
    const error = new Error(
      'SENDGRID_API_KEY is not set. Email cannot be sent.',
    );
    console.error('sendSeverEmail configuration error:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  if (!process.env.TO_EMAIL_ADDRESS) {
    const error = new Error(
      'TO_EMAIL_ADDRESS is not set. Email cannot be sent.',
    );
    console.error('sendSeverEmail configuration error:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  const data = {
    personalizations: [
      {
        to: [
          {
            email: process.env.TO_EMAIL_ADDRESS,
          },
        ],
        subject,
      },
    ],
    from: {
      email: 'noreply@unleashedpotentiallifecoaching.com',
      name: '<noreply@unleashedpotentiallifecoaching.com>',
    },
    content: [
      {
        type: 'text/html',
        value: body,
      },
    ],
  };

  try {
    const response = await fetch(SENDGRID_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const responseBody = await response.text();
    let parsedBody: unknown = null;

    if (responseBody) {
      try {
        parsedBody = JSON.parse(responseBody);
      } catch (parseError) {
        parsedBody = { parseError, raw: responseBody };
      }
    }

    if (!response.ok) {
      const errorMessage =
        typeof parsedBody === 'object' &&
        parsedBody !== null &&
        'errors' in parsedBody
          ? JSON.stringify((parsedBody as { errors?: unknown }).errors)
          : response.statusText || 'Unknown error';

      throw new Error(
        `SendGrid request failed. Status: ${response.status}. Message: ${errorMessage}`,
      );
    }

    return {
      success: true,
      status: response.status,
      body: parsedBody,
    };
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error('Unexpected error while sending server email');

    console.error('sendSeverEmail error:', err);

    return {
      success: false,
      error: err.message,
      stack: err.stack,
    };
  }
};

export default sendSeverEmail;
