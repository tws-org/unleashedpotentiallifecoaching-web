import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { markSent, putSubmission } from './store';

const record = {
  id: 'abc',
  formType: 'contact' as const,
  createdAt: '2026-10-17T12:00:00.000Z',
  spamResult: 'unchecked' as const,
  isTest: true,
};

// Fake AWS: capture each request and answer with the status we choose.
const fakeDynamo = (status: number) => {
  const fetchMock = vi.fn(
    async (_request: Request) =>
      new Response('{}', {
        status,
      }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

// Read back the JSON body that was sent to DynamoDB.
const sentBody = (fetchMock: ReturnType<typeof fakeDynamo>) => {
  const request = fetchMock.mock.calls[0][0];
  return request.json();
};

beforeEach(() => {
  vi.stubEnv('AWS_REGION', 'us-east-2');
  vi.stubEnv('AWS_ACCESS_KEY_ID', 'test-key');
  vi.stubEnv('AWS_SECRET_ACCESS_KEY', 'test-secret');
  vi.stubEnv('SUBMISSIONS_TABLE', 'contact-submissions');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('putSubmission', () => {
  it('writes a metadata-only item that expires in 12 months', async () => {
    const fetchMock = fakeDynamo(200);
    await putSubmission(record);

    const body = await sentBody(fetchMock);
    expect(body.Item.pk).toEqual({ S: 'sub#abc' });
    expect(body.Item.isTest).toEqual({ BOOL: true });
    expect(Number(body.Item.expiresAt.N)).toBe(
      Date.parse(record.createdAt) / 1000 + 365 * 24 * 60 * 60,
    );
    expect(body.ConditionExpression).toBe('attribute_not_exists(pk)');
  });

  it('rejects when DynamoDB fails, so the route can fail open', async () => {
    fakeDynamo(400);
    await expect(putSubmission(record)).rejects.toThrow('DynamoDB PutItem 400');
  });
});

describe('markSent', () => {
  it('stores NULL when SendGrid gives no message ID', async () => {
    const fetchMock = fakeDynamo(200);
    await markSent('abc', 'failed', null);

    const body = await sentBody(fetchMock);
    expect(body.ExpressionAttributeValues[':messageId']).toEqual({
      NULL: true,
    });
  });
});
