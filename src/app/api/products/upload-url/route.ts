import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // 1. Auth Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      console.error("❌ Upload Blocked: User is not admin", session?.user);
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Parse Body
    const { fileName, fileType } = await request.json();
    if (!fileName || !fileType) {
      return new Response("Missing fileName or fileType", { status: 400 });
    }

    const fileKey = `products/${randomUUID()}-${fileName}`;

    // 3. Generate Signed URL
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    return Response.json({ signedUrl, fileKey });
  } catch (error: unknown) {
    // THIS IS THE IMPORTANT PART
    console.error("🔥 R2 Upload Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Server Error: ${message}`, { status: 500 });
  }
}
