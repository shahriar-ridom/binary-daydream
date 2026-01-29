import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleProductAvailability } from "@/app/actions/products";
import { ProductActions } from "@/components/admin/product-actions";

export default async function AdminProductsPage() {
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      priceInCents: products.priceInCents,
      isAvailable: products.isAvailable,
      ordersCount: count(orders.id),
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(orders, eq(products.id, orders.productId))
    .groupBy(products.id)
    .orderBy(desc(products.createdAt));

  return (
    <div className="space-y-8 p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Global Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage asset availability and pricing protocols.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button
            size="lg"
            className="group rounded-xl bg-primary text-primary-foreground! hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
          >
            <span className="mr-2 text-lg leading-none">+</span>
            Deploy Asset
          </Button>
        </Link>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-75 text-xs font-bold uppercase tracking-widest text-muted-foreground py-5">
                Asset Identity
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Valuation
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Sales
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Status Protocol
              </TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground pr-6">
                Operations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4M12 20V4"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      No assets found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              productList.map((product) => (
                <TableRow
                  key={product.id}
                  className="group hover:bg-secondary/40 transition-colors border-border/50"
                >
                  {/* Name & Date */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono mt-1">
                        Deployed:{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="font-mono text-sm font-medium text-foreground">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.priceInCents / 100)}
                    </div>
                  </TableCell>

                  {/* Sales Count */}
                  <TableCell>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-foreground border border-border">
                      <svg
                        className="w-3 h-3 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      {product.ordersCount}
                    </div>
                  </TableCell>

                  {/* Availability Toggle */}
                  <TableCell>
                    <AvailabilityToggle
                      productId={product.id}
                      isAvailable={product.isAvailable}
                    />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end [&&_svg]:text-white! [&&_button]:text-white! hover:[&&_svg]:text-primary!">
                      <ProductActions id={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// COMPONENT: Availability Toggle
// ------------------------------------------------------------------
function AvailabilityToggle({
  productId,
  isAvailable,
}: {
  productId: number;
  isAvailable: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await toggleProductAvailability(productId, !isAvailable);
      }}
    >
      <button
        type="submit"
        className="group relative flex items-center gap-3 cursor-pointer outline-none"
      >
        {/* The Track */}
        <div
          className={`
            relative h-6 w-11 rounded-full border transition-all duration-300 ease-out
            ${
              isAvailable
                ? "bg-emerald-500/10 border-emerald-500/50"
                : "bg-zinc-800 border-zinc-700"
            }
          `}
        >
          {/* The Thumb */}
          <div
            className={`
              absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center
              ${
                isAvailable
                  ? "translate-x-5 bg-emerald-400"
                  : "translate-x-0 bg-zinc-500"
              }
            `}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* The Label */}
        <span
          className={`
            text-xs font-medium uppercase tracking-wider transition-colors duration-300
            ${isAvailable ? "text-emerald-400" : "text-zinc-500"}
          `}
        >
          {isAvailable ? "Active" : "Draft"}
        </span>
      </button>
    </form>
  );
}
