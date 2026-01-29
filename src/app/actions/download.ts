"use server";

import { db } from "@/db";
import { downloadVerifications, orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createDownloadLink(orderId: string) {
  // 1. Auth Check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // 2. Security Check: Does the user own this specific order?
  // We query the order AND ensure the userId matches the session.
  const [order] = await db
    .select()
    .from(orders)
    .where(and(
      eq(orders.id, orderId),
      eq(orders.userId, session.user.id)
    ))
    .limit(1);

  if (!order) {
    return { error: "Order not found or access denied" };
  }

  // 3. Create the "One-Day Pass" (Download Verification)
  // This creates a UUID in the DB that is valid for 24 hours.
  const [verification] = await db
    .insert(downloadVerifications)
    .values({
      productId: order.productId,
    })
    .returning({ id: downloadVerifications.id });

  // 4. Redirect to the API Route
  // This API route (which we built in Step 4) will trade this ID for an R2 Signed URL
  redirect(`/api/download/${verification.id}`);
}
