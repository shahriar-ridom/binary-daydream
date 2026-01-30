import { db } from "@/db";
import { downloadVerifications, products } from "@/db/schema";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  // 1. Update Type: params is a Promise now
  { params }: { params: Promise<{ id: string }> },
) {
  // 2. Await the params
  const { id } = await params;
  const verificationId = id;

  const [verification] = await db
    .select()
    .from(downloadVerifications)
    .where(eq(downloadVerifications.id, verificationId))
    .innerJoin(products, eq(products.id, downloadVerifications.productId));

  if (!verification) {
    return new NextResponse("Invalid Link", { status: 403 });
  }

  const { download_verifications, products: product } = verification;

  if (new Date() > download_verifications.expiresAt) {
    return new NextResponse("Link Expired", { status: 410 });
  }

  // Handle Extension logic
  const fileExtension = product.filePath.split(".").pop();
  const safeFileName = product.name.replace(/[^a-zA-Z0-9-_ ]/g, "");

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: product.filePath,
    ResponseContentDisposition: `attachment; filename="${safeFileName}.${fileExtension}"`,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

  return NextResponse.redirect(signedUrl);
}
