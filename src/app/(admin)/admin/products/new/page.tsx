import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-purple-500/20 border border-primary/10">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Add New Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a new digital asset for your store
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 rounded-xl border border-border bg-card/30 p-4">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Tips for great listings
                </p>
                <p className="text-muted-foreground mt-1">
                  Use clear, descriptive names. Set competitive prices. Upload
                  high-quality cover images (16:9 ratio works best).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <ProductForm />
      </div>
    </div>
  );
}
