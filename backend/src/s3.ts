import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET!;

if (!REGION || !BUCKET) {
  console.warn("AWS_REGION or S3_BUCKET not set. S3 operations will fail until configured.");
}

export const s3 = new S3Client({ region: REGION });

export async function createPresignedPutUrl(key: string, contentType = "application/octet-stream", expiresIn = 900) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read"
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url, key, bucket: BUCKET, publicUrl: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}` };
}