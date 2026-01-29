import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DownloadButton } from "@/components/download-button";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const userOrders = await db
    .select({
      orderId: orders.id,
      pricePaid: orders.pricePaidInCents,
      createdAt: orders.createdAt,
      productName: products.name,
      productDesc: products.description,
      imagePath: products.imagePath,
      productId: products.id,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="min-h-screen pt-10 bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-purple-900/20 blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] h-100 w-100 rounded-full bg-indigo-900/20 blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8">
        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-in slide-in-from-top-4 duration-700 fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Portfolio Status: Active
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              My Vault
            </h1>
            <p className="mt-2 text-lg text-muted-foreground font-light max-w-md">
              Secure storage for your acquired digital assets.
            </p>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-3 rounded-full border border-border bg-card/50 px-5 py-2.5 backdrop-blur-md shadow-sm">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
              {session.user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Logged in as
              </span>
              <span className="text-sm font-semibold text-foreground">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {success && (
          <div className="mb-12 animate-in zoom-in-95 duration-500">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/20 blur-xl" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <svg
                    className="w-5 h-5"
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
                <div>
                  <h3 className="font-heading font-bold text-emerald-400 text-lg">
                    Transaction Verified
                  </h3>
                  <p className="text-emerald-500/80 text-sm">
                    Asset ownership rights have been transferred to your vault.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT GRID */}
        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-border bg-card/30 p-24 text-center backdrop-blur-sm animate-in fade-in duration-700">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
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
                  d="M20 12H4M12 20V4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Vault Empty
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              You haven&apos;t acquired any assets yet. Visit the marketplace to
              start building your collection.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/10"
            >
              Access Store
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {userOrders.map((item, index) => (
              <div
                key={item.orderId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-4 transition-all duration-500 hover:border-ring hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col gap-5">
                  {/* Image Area */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
                    <Image
                      src={`/api/images/${item.imagePath}`}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-3 right-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-xl">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.pricePaid / 100)}
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-lg font-heading font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.productName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Acquired {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Area */}
                <div className="mt-6 border-t border-border pt-4 px-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Ready
                      </span>
                    </div>

                    <div
                      className="
                      [&>a]:inline-flex [&>a]:items-center [&>a]:justify-center
                      [&>a]:rounded-xl [&>a]:bg-secondary [&>a]:px-4 [&>a]:py-2
                      [&>a]:text-sm [&>a]:font-medium [&>a]:text-secondary-foreground
                      [&>a]:transition-colors [&>a]:hover:bg-primary [&>a]:hover:text-primary-foreground
                      [&>button]:inline-flex [&>button]:items-center [&>button]:justify-center
                      [&>button]:rounded-xl [&>button]:bg-secondary [&>button]:px-4 [&>button]:py-2
                      [&>button]:text-sm [&>button]:font-medium [&>button]:text-secondary-foreground
                      [&>button]:transition-colors [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground
                    "
                    >
                      <DownloadButton orderId={item.orderId} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
