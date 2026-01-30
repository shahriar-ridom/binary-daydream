"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "./ui/dialog";
import { BuyButton } from "./buy-button";
import type { Product } from "./product-card";

interface ProductDetailDialogProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailDialog({
  product,
  open,
  onClose,
}: ProductDetailDialogProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.priceInCents / 100);

  useEffect(() => {
    const navbar = document.getElementById("navbar-pill");
    if (navbar) {
      if (open) {
        navbar.style.transform = "translateY(-150%)";
        navbar.style.opacity = "0";
      } else {
        navbar.style.transform = "translateY(0)";
        navbar.style.opacity = "1";
      }
    }
    return () => {
      if (navbar) {
        navbar.style.transform = "translateY(0)";
        navbar.style.opacity = "1";
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        className="
          z-50
          p-0
          bg-card
          shadow-2xl shadow-black/50

          /* --- MOBILE ARCHITECTURE --- */
          w-full h-dvh
          max-w-none
          rounded-none
          border-0

          /* --- DESKTOP ARCHITECTURE --- */
          md:h-auto md:max-h-[90vh]
          md:w-[90vw] md:max-w-4xl
          md:rounded-3xl
          md:border md:border-border

          /* SCROLLING ENGINE */
          overflow-y-auto overflow-x-hidden

          /* PHYSICS */
          data-[state=open]:animate-dialog-open
          data-[state=closed]:animate-dialog-closed
        "
      >
        {/* Close Button */}
        <div className="fixed md:absolute right-4 top-4 z-50">
          <button
            type="button"
            onClick={onClose}
            className="group rounded-full bg-black/40 p-2 text-white backdrop-blur-xl border border-white/10 transition-all hover:bg-destructive hover:text-destructive-foreground hover:rotate-90 shadow-lg"
          >
            <svg
              className="h-6 w-6 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 min-h-full">
          <div className="relative h-[40vh] md:h-auto w-full bg-muted border-b border-border md:border-b-0 md:border-r">
            <Image
              src={`/api/images/${product.imagePath}`}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90 transition-opacity hover:opacity-100"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-80" />

            {!product.isAvailable && (
              <div className="absolute left-4 top-4 rounded-full border border-destructive/30 bg-destructive/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive backdrop-blur-md">
                Unavailable
              </div>
            )}
          </div>

          {/* DATA COLUMN */}
          <div className="flex flex-col bg-card min-h-[60vh] md:min-h-0">
            <div className="flex-1 p-6 md:p-8">
              <div className="mb-8">
                <h2 className="mb-2 text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-card-foreground">
                  {product.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold font-heading text-primary">
                    {formattedPrice}
                  </span>
                  <span className="rounded-md border border-border bg-secondary px-2 py-1 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                    One-time Asset
                  </span>
                </div>
              </div>

              <div className="space-y-8 pb-24 md:pb-0">
                {product.description && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                      Asset Brief
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground font-sans">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Specs Grid */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                    Technical Specs
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="p-3">
                        <div className="text-[10px] text-muted-foreground">
                          Format
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          Digital Bundle
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-[10px] text-muted-foreground">
                          License
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          Commercial
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "High-Fidelity Output",
                    "Royalty-Free Usage",
                    "Instant Secure Transfer",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 z-10 border-t border-border bg-card/80 p-5 backdrop-blur-xl md:static md:bg-transparent md:pt-6 pb-8 md:pb-6">
              {product.isAvailable ? (
                <div className="space-y-3">
                  <div className="[&>button]:w-full [&>button]:h-14 [&>button]:text-lg [&>button]:rounded-xl [&>button]:font-heading [&>button]:shadow-xl [&>button]:shadow-primary/10">
                    <BuyButton
                      productId={product.id}
                      priceInCents={product.priceInCents}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                    <span>256-bit Encrypted Transaction</span>
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 py-4 font-bold text-destructive opacity-50 cursor-not-allowed"
                >
                  <span>Stock Depleted</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
