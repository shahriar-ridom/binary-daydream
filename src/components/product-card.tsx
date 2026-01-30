"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductDetailDialog } from "./product-detail-dialog";

export interface Product {
  id: number;
  name: string;
  priceInCents: number;
  description: string | null;
  imagePath: string;
  isAvailable: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const [showDialog, setShowDialog] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.priceInCents / 100);

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:border-ring/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
        onClick={() => setShowDialog(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDialog(true);
          }
        }}
      >
        {/* IMAGE CHAMBER */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
          {/* Main Image */}
          <Image
            src={`/api/images/${product.imagePath}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100 opacity-90"
          />

          {/* Status Badge */}
          {!product.isAvailable && (
            <div className="absolute top-4 right-4 z-20">
              <span className="inline-flex items-center rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive backdrop-blur-md">
                Unavailable
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

          {/* Quick View HUD) */}
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full transform p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-background/60 p-3 text-sm font-medium text-foreground backdrop-blur-md border border-border/50 shadow-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Quick Inspect</span>
            </div>
          </div>
        </div>

        {/* DATA PANEL */}
        <div className="flex flex-1 flex-col justify-between p-6 pt-2">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-xl font-heading pt-2 font-bold leading-tight text-card-foreground transition-colors group-hover:text-primary">
                {product.name}
              </h3>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </span>
              <span className="text-lg font-bold text-foreground font-heading">
                {formattedPrice}
              </span>
            </div>

            <div className="group/btn relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/20">
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <ProductDetailDialog
        product={product}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}
