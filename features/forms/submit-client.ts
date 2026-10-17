interface Email {
  body: string;
  subject: string;
  type?: string;
}

const sendClientEmail = async (props: Email) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(props),
    });

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch (jsonError) {
      // Swallow JSON errors so we can still surface the HTTP response status below.
      payload = { parseError: jsonError };
    }

    if (!response.ok) {
      const errorMessage =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? ((payload as { message?: string }).message ?? 'Unknown error')
          : response.statusText || 'Unknown error';

      throw new Error(
        `Failed to send email. Status: ${response.status}. Message: ${errorMessage}`,
      );
    }

    return { success: true, data: payload };
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error('Unexpected error while sending client email');

    console.error('sendClientEmail error:', err);

    return {
      success: false,
      error: err.message,
      stack: err.stack,
    };
  }
};

export default sendClientEmail;
