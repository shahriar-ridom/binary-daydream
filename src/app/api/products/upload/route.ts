import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  // Security Check: Only Admins can upload
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (session?.user.role !== "admin")
    return new Response("Unauthorized", { status: 401 });

  const { fileName, fileType } = await request.json();

  const fileKey = `products/${randomUUID()}-${fileName}`;

  // Generate the Signed URL
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  // URL valid for 5 minutes
  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  return Response.json({ signedUrl, fileKey });
}
