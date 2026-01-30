import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { count, sum, desc, eq, sql } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function AdminOrdersPage() {
  // Fetch all data in parallel
  const [
    totalRevenueResult,
    totalOrdersResult,
    avgOrderValueResult,
    allOrdersList,
    revenueByProductList,
    dailySalesData,
  ] = await Promise.all([
    // Total Revenue
    db.select({ total: sum(orders.pricePaidInCents) }).from(orders),
    // Total Orders
    db.select({ count: count() }).from(orders),
    // Average Order Value
    db
      .select({
        avg: sql<number>`ROUND(AVG(${orders.pricePaidInCents}))`,
      })
      .from(orders),
    // All Orders with details
    db
      .select({
        orderId: orders.id,
        pricePaid: orders.pricePaidInCents,
        createdAt: orders.createdAt,
        stripePaymentIntentId: orders.stripePaymentIntentId,
        productId: products.id,
        productName: products.name,
        userId: users.id,
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt)),
    // Revenue by Product
    db
      .select({
        productId: products.id,
        productName: products.name,
        salesCount: count(orders.id),
        totalRevenue: sum(orders.pricePaidInCents),
      })
      .from(products)
      .innerJoin(orders, eq(products.id, orders.productId))
      .groupBy(products.id)
      .orderBy(desc(sum(orders.pricePaidInCents))),
    // Daily Sales (last 7 days)
    db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        count: count(),
        revenue: sum(orders.pricePaidInCents),
      })
      .from(orders)
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(desc(sql`DATE(${orders.createdAt})`))
      .limit(7),
  ]);

  const totalRevenue = Number(totalRevenueResult[0]?.total ?? 0);
  const totalOrders = totalOrdersResult[0]?.count ?? 0;
  const avgOrderValue = Number(avgOrderValueResult[0]?.avg ?? 0);

  // Calculate max revenue for chart scaling
  const maxDailyRevenue = Math.max(
    ...dailySalesData.map((d) => Number(d.revenue ?? 0)),
    1,
  );

  const stats = [
    {
      name: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "All-time earnings",
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
      name: "Avg Order Value",
      value: formatCurrency(avgOrderValue),
      description: "Per transaction",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
    },
    {
      name: "Products Sold",
      value: revenueByProductList.length.toString(),
      description: "Unique items",
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
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Revenue Stream Active
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Sales & Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive transaction analytics and order management.
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative group rounded-2xl border border-border bg-card p-6 overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-xl"
          >
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
        {/* DAILY SALES CHART */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-heading font-bold text-foreground mb-2">
            Recent Activity
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Last 7 days of sales
          </p>

          {dailySalesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...dailySalesData].reverse().map((day) => {
                const revenue = Number(day.revenue ?? 0);
                const percentage = (revenue / maxDailyRevenue) * 100;
                return (
                  <div key={day.date} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-mono">
                        {formatShortDate(new Date(day.date))}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-green-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {day.count} order{day.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REVENUE BY PRODUCT */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-heading font-bold text-foreground">
              Revenue by Product
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Performance breakdown by asset
            </p>
          </div>

          {revenueByProductList.length === 0 ? (
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No products sold</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-4">
                    Product
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Sales
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Revenue
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Share
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByProductList.map((product) => {
                  const revenue = Number(product.totalRevenue ?? 0);
                  const sharePercentage =
                    totalRevenue > 0
                      ? ((revenue / totalRevenue) * 100).toFixed(1)
                      : "0";
                  return (
                    <TableRow
                      key={product.productId}
                      className="border-border hover:bg-secondary/20"
                    >
                      <TableCell className="py-4">
                        <span className="font-medium text-foreground">
                          {product.productName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {product.salesCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-400">
                        {formatCurrency(revenue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-purple-500"
                              style={{ width: `${sharePercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {sharePercentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* ALL ORDERS TABLE */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            All Transactions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete order history with payment details
          </p>
        </div>

        {allOrdersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
              <svg
                className="w-8 h-8"
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
              No orders yet
            </p>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers make purchases
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-4">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrdersList.map((order) => (
                <TableRow
                  key={order.orderId}
                  className="group border-border hover:bg-secondary/20"
                >
                  <TableCell className="py-4">
                    <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {order.orderId.slice(0, 8)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {order.userEmail?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {order.userName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {order.userEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      {order.productName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(order.pricePaid)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
                      Completed
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
