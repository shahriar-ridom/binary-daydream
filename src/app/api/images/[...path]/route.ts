import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  // 1. Update Type Definition: params is now a Promise
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // 2. Await the params before using them (The Fix)
    const { path } = await params;

    const key = path.join("/");

    // 3. Fetch from R2
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await r2.send(command);

    const stream = response.Body as unknown as ReadableStream;

    return new NextResponse(stream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image Proxy Error:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
