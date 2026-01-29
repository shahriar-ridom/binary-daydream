import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, asc, eq, ilike, and, gte, lte, sql } from "drizzle-orm";
import { ProductCard } from "@/components/product-card";
import { Footer } from "@/components/footer";
import { StoreFilters } from "@/components/store-filters";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = params.sort || "newest";
  const minPrice = params.minPrice
    ? parseInt(params.minPrice) * 100
    : undefined;
  const maxPrice = params.maxPrice
    ? parseInt(params.maxPrice) * 100
    : undefined;
  const availability = params.availability || "all";

  // Build filter conditions
  const conditions = [];

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  if (minPrice !== undefined) {
    conditions.push(gte(products.priceInCents, minPrice));
  }

  if (maxPrice !== undefined) {
    conditions.push(lte(products.priceInCents, maxPrice));
  }

  if (availability === "available") {
    conditions.push(eq(products.isAvailable, true));
  } else if (availability === "unavailable") {
    conditions.push(eq(products.isAvailable, false));
  }

  // Build sort order
  let orderBy;
  switch (sort) {
    case "oldest":
      orderBy = asc(products.createdAt);
      break;
    case "price-low":
      orderBy = asc(products.priceInCents);
      break;
    case "price-high":
      orderBy = desc(products.priceInCents);
      break;
    case "name-az":
      orderBy = asc(products.name);
      break;
    case "name-za":
      orderBy = desc(products.name);
      break;
    case "newest":
    default:
      orderBy = desc(products.createdAt);
  }

  // Fetch products with filters
  const allProducts = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy);

  // Get price range for filter
  const priceStats = await db
    .select({
      minPrice: sql<number>`MIN(${products.priceInCents})`,
      maxPrice: sql<number>`MAX(${products.priceInCents})`,
    })
    .from(products);

  const priceRange = {
    min: Math.floor((priceStats[0]?.minPrice || 0) / 100),
    max: Math.ceil((priceStats[0]?.maxPrice || 10000) / 100),
  };

  // Get total counts for availability filter
  const [totalCount, availableCount, unavailableCount] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(products),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.isAvailable, true)),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.isAvailable, false)),
  ]);

  const counts = {
    total: Number(totalCount[0]?.count || 0),
    available: Number(availableCount[0]?.count || 0),
    unavailable: Number(unavailableCount[0]?.count || 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-200 w-200 rounded-full bg-purple-900/20 blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] h-200 w-200 rounded-full bg-indigo-900/20 blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] invert-0" />
      </div>

      <div className="relative z-10">
        {/* HERO HEADER */}
        <section className="pt-32 pb-12 px-6 lg:px-8 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center animate-in fade-in duration-700">
              <span className="mb-4 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Digital Marketplace
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-foreground via-muted-foreground to-muted mb-6">
                Asset Store
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Browse our complete catalog of premium digital assets.
                High-quality tools for high-performance creators.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <StoreFilters
              priceRange={priceRange}
              counts={counts}
              currentFilters={{
                search,
                sort,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                availability,
              }}
            />

            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {allProducts.length}
                </span>{" "}
                {allProducts.length === 1 ? "asset" : "assets"}
                {search && (
                  <>
                    {" "}
                    for{" "}
                    <span className="font-medium text-foreground">
                      &quot;{search}&quot;
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {allProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border bg-card/50">
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-card rounded-full border border-border">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No Assets Found
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {search
                    ? `No assets match your search for "${search}". Try adjusting your filters or search terms.`
                    : "No assets match your current filters. Try adjusting your criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
