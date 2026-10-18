import { AwsClient } from 'aws4fetch';
import { FormType } from '../forms/schemas';

export type SubmissionRecord = {
  id: string;
  formType: FormType;
  createdAt: string; // ISO time, e.g. new Date().toISOString()
  spamResult: 'unchecked' | 'passed' | 'blocked';
  isTest: boolean;
};
const RETENTION_SECONDS = 365 * 24 * 60 * 60; // 12 months
const expiresAt = (createdAt: string) =>
  Math.floor(new Date(createdAt).getTime() / 1000) + RETENTION_SECONDS;

const toItem = (r: SubmissionRecord) => ({
  pk: { S: `sub#${r.id}` },
  formType: { S: r.formType },
  createdAt: { S: r.createdAt },
  spamResult: { S: r.spamResult },
  isTest: { BOOL: r.isTest },
  expiresAt: { N: String(expiresAt(r.createdAt)) },
});

// Build the client per call: on Workers, env values are read at request
// time.
const dynamo = async (action: 'PutItem' | 'UpdateItem', body: object) => {
  const region = process.env.AWS_REGION as string;
  const aws = new AwsClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region,
    service: 'dynamodb',
  });
  const res = await aws.fetch(`https://dynamodb.${region}.amazonaws.com/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.0',
      'X-Amz-Target': `DynamoDB_20120810.${action}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`DynamoDB ${action} ${res.status}: ${await res.text()}`);
  return res.json();
};

export const putSubmission = (record: SubmissionRecord) =>
  dynamo('PutItem', {
    TableName: process.env.SUBMISSIONS_TABLE,
    Item: toItem(record),
    ConditionExpression: 'attribute_not_exists(pk)',
  });

export const markSent = (
  id: string,
  status: 'sent' | 'failed',
  messageId: string | null,
) =>
  dynamo('UpdateItem', {
    TableName: process.env.SUBMISSIONS_TABLE,
    Key: { pk: { S: `sub#${id}` } },
    UpdateExpression: 'SET #status = :status, sendgridMessageId = :messageId',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': { S: status },
      ':messageId': messageId ? { S: messageId } : { NULL: true },
    },
    ConditionExpression: 'attribute_exists(pk)',
  });
