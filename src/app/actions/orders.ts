"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSession(productId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Specific Auth Check
  if (!session?.user) {
    // Return a specific object so the frontend knows EXACTLY what to do
    return { error: "unauthorized" };
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) {
    return { error: "Product not found" };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}?canceled=true`,
    customer_email: session.user.email,
    mode: "payment",
    metadata: {
      userId: session.user.id,
      productId: product.id.toString(),
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.priceInCents,
        },
      },
    ],
  });

  if (!stripeSession.url) {
    return { error: "Failed to create checkout session" };
  }

  redirect(stripeSession.url);
}
