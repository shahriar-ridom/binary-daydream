import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { count, sum, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboardPage() {
  // Fetch all stats in parallel
  const [
    totalRevenueResult,
    totalOrdersResult,
    totalProductsResult,
    totalCustomersResult,
    recentOrdersList,
    topProductsList,
  ] = await Promise.all([
    // Total Revenue
    db.select({ total: sum(orders.pricePaidInCents) }).from(orders),
    // Total Orders
    db.select({ count: count() }).from(orders),
    // Total Products
    db.select({ count: count() }).from(products),
    // Total Customers
    db
      .selectDistinct({ userId: orders.userId })
      .from(orders)
      .then((res) => res.length),
    // Recent Orders (last 5)
    db
      .select({
        orderId: orders.id,
        pricePaid: orders.pricePaidInCents,
        createdAt: orders.createdAt,
        productName: products.name,
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5),
    // Top Products by sales
    db
      .select({
        productId: products.id,
        productName: products.name,
        salesCount: count(orders.id),
        totalRevenue: sum(orders.pricePaidInCents),
      })
      .from(products)
      .leftJoin(orders, eq(products.id, orders.productId))
      .groupBy(products.id)
      .orderBy(desc(count(orders.id)))
      .limit(5),
  ]);

  const totalRevenue = Number(totalRevenueResult[0]?.total ?? 0);
  const totalOrders = totalOrdersResult[0]?.count ?? 0;
  const totalProducts = totalProductsResult[0]?.count ?? 0;
  const totalCustomers = totalCustomersResult;

  const stats = [
    {
      name: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Lifetime earnings",
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/20",
    },
    {
      name: "Total Orders",
      value: totalOrders.toString(),
      description: "Completed transactions",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
    },
    {
      name: "Active Assets",
      value: totalProducts.toString(),
      description: "Products in catalog",
      icon: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      color: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
    },
    {
      name: "Total Customers",
      value: totalCustomers.toString(),
      description: "Unique buyers",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
    },
  ];

  const quickActions = [
    {
      name: "Deploy Asset",
      description: "Add a new product to the catalog",
      href: "/admin/products/new",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      name: "View Inventory",
      description: "Manage existing products",
      href: "/admin/products",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      name: "View Storefront",
      description: "Preview the public store",
      href: "/",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              System Status: Operational
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor performance metrics and manage operations.
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

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="relative group rounded-2xl border border-border bg-card p-6 overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background glow effect */}
            <div
              className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${stat.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground">{stat.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                Recent Transactions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Latest order activity
              </p>
            </div>
            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
              >
                View All
              </Button>
            </Link>
          </div>

          {recentOrdersList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground mb-1">
                No transactions yet
              </p>
              <p className="text-sm text-muted-foreground">
                Orders will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-4">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrdersList.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className="border-border hover:bg-secondary/20"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {order.userEmail?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-37.5">
                            {order.userName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-37.5">
                            {order.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {order.productName}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(order.pricePaid)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-border/80 transition-all duration-200 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {action.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* TOP PRODUCTS */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Top Performers
            </h2>
            {topProductsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sales data yet
              </p>
            ) : (
              <div className="space-y-4">
                {topProductsList.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.salesCount} sales •{" "}
                        {formatCurrency(Number(product.totalRevenue ?? 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
