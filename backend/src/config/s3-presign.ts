import { webcrypto as crypto } from 'node:crypto';
import { TextEncoder } from 'util';

export async function generateS3PresignedUrl(
  env: any,
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const bucket = env.AWS_S3_BUCKET_NAME;
  const region = env.AWS_REGION;
  const accessKey = env.AWS_ACCESS_KEY_ID;
  const secretKey = env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKey || !secretKey) {
    throw new Error("Missing AWS S3 configuration in environment variables");
  }

  const sanitizedFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  const key = `blogs/${Date.now()}-${sanitizedFileName}`;

  const date = new Date();
  const dateStamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const expiresIn = 3600;

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const credential = `${accessKey}/${credentialScope}`;

  const canonicalQueryString = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeURIComponent(credential)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expiresIn}`,
    `X-Amz-SignedHeaders=host`
  ].sort().join('&');

  const canonicalUri = '/' + key.split('/').map(encodeURIComponent).join('/');
  const canonicalHeaders = `host:${bucket}.s3.${region}.amazonaws.com\n`;
  const signedHeaders = 'host';
  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHash
  ].join('\n');

  const signingKey = await getSignatureKey(secretKey, dateStamp, region, 's3');
  const signature = await hmacSha256Hex(signingKey, stringToSign);

  const uploadUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: Uint8Array | ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const keyArray = key instanceof Uint8Array ? key : new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyArray,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message)) as ArrayBuffer;
}

async function hmacSha256Hex(key: ArrayBuffer, message: string): Promise<string> {
  const signature = await hmacSha256(key, message);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const initialKey = new TextEncoder().encode(`AWS4${secretKey}`);
  const kDate = await hmacSha256(initialKey, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return await hmacSha256(kService, 'aws4_request');
}