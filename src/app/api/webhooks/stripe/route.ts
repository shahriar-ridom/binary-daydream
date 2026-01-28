import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  // Verify the Security Signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error(`Webhook Signature Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the "Checkout Completed" Event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract the Metadata we sent during checkout
    const userId = session.metadata?.userId;
    const productIdRaw = session.metadata?.productId;
    const paymentIntentId = session.payment_intent as string;
    const totalAmount = session.amount_total;

    // Validation: If data is missing, we can't fulfill the order.
    if (!userId || !productIdRaw || !totalAmount || !paymentIntentId) {
      console.error("Missing metadata in Stripe Webhook", session.metadata);
      return new NextResponse("Webhook Error: Missing Metadata", {
        status: 400,
      });
    }

    const productId = parseInt(productIdRaw);

    try {
      // Idempotency Check
      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.stripePaymentIntentId, paymentIntentId),
      });

      if (existingOrder) {
        console.log("Order already exists. Skipping.");
        return new NextResponse("Order already exists", { status: 200 });
      }

      // Insert the Order
      await db.insert(orders).values({
        userId,
        productId,
        pricePaidInCents: totalAmount,
        stripePaymentIntentId: paymentIntentId,
      });

      console.log(`✅ Order created for User ${userId}, Product ${productId}`);

      // (Optional) Send Email Here using Resend
      // await sendReceiptEmail(...)
    } catch (error) {
      console.error("Database Error processing webhook:", error);
      // Return 500 so Stripe knows to retry later if it was a DB blip
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  // Return 200 OK to acknowledge receipt
  return new NextResponse("Received", { status: 200 });
}
