"use client";

import { createCheckoutSession } from "@/app/actions/orders";
import { useTransition } from "react";

export function BuyButton({ productId, priceInCents }: { productId: number, priceInCents: number }) {
  const [isPending, startTransition] = useTransition();

  // Helper to format cents to dollars
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);

  return (
    <button
      onClick={() => startTransition(async () => {
         await createCheckoutSession(productId);
      })}
      disabled={isPending}
      className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending ? "Redirecting..." : `Buy Now for ${formattedPrice}`}
    </button>
  );
}
