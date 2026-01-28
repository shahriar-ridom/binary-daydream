import { db } from "@/db";
import { downloadVerifications, products } from "@/db/schema";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const verificationId = params.id;

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

  // Extract extension from the ACTUAL stored file path
  const fileExtension = product.filePath.split(".").pop();

  // Sanitize the Product Name for the Filename Header
  const safeFileName = product.name.replace(/[^a-zA-Z0-9-_ ]/g, "");

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: product.filePath,
    ResponseContentDisposition: `attachment; filename="${safeFileName}.${fileExtension}"`,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

  return NextResponse.redirect(signedUrl);
}
