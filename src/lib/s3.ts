import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn("AWS S3 credentials not configured");
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "eu-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET ?? "mmk-registered-office";

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}
