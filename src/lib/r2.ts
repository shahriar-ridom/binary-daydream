import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// 1. HARD STOP if keys are missing
if (!accountId || !accessKeyId || !secretAccessKey) {
  // Console log to debug (Don't worry, server logs are private)
  console.error("❌ R2 CONFIG ERROR: Missing Environment Variables");
  console.error({
    accountId: accountId ? "Set ✅" : "MISSING ❌",
    accessKeyId: accessKeyId ? "Set ✅" : "MISSING ❌",
    secretAccessKey: secretAccessKey ? "Set ✅" : "MISSING ❌",
  });
  throw new Error("R2 Environment Variables are missing. Check .env.local");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
