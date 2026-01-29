"use client";

import { createCheckoutSession } from "@/app/actions/orders";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

export function BuyButton({
  productId,
  priceInCents,
}: {
  productId: number;
  priceInCents: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);

  const handleBuy = () => {
    startTransition(async () => {
      const result = await createCheckoutSession(productId);

      if (result && result.error) {
        if (result.error === "unauthorized") {
          router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
          return;
        }
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleBuy}
      disabled={isPending}
      className={`
        group relative w-full overflow-hidden rounded-full bg-white py-3 md:py-4 text-base md:text-lg font-bold text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300
        hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)]
        active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70
      `}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-gray-200/50 to-transparent transition-transform duration-1000 group-hover:animate-[shimmer_1.5s_infinite]" />

      {/* Content Layer */}
      <div className="relative flex items-center justify-center gap-2 md:gap-3">
        {isPending ? (
          <>
            <svg
              className="h-5 w-5 md:h-6 md:w-6 animate-spin text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Purchase</span>
            <span className="hidden xs:inline h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-black/30" />
            <span>{formattedPrice}</span>
            <svg
              className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </>
        )}
      </div>
    </button>
  );
}
