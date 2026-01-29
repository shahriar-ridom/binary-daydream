import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { count, sum, desc, eq, sql } from "drizzle-orm";
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
  }).format(date);
}

export default async function AdminUsersPage() {
  // Fetch all data in parallel
  const [totalCustomersResult, totalUsersResult, customerList] =
    await Promise.all([
      // Customers (users with orders)
      db
        .selectDistinct({ userId: orders.userId })
        .from(orders)
        .then((res) => res.length),
      // Total users
      db.select({ count: count() }).from(users),
      // Customers with their purchase details
      db
        .select({
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userImage: users.image,
          userRole: users.role,
          userCreatedAt: users.createdAt,
          totalOrders: count(orders.id),
          totalSpent: sum(orders.pricePaidInCents),
          lastOrderDate: sql<Date>`MAX(${orders.createdAt})`,
        })
        .from(users)
        .leftJoin(orders, eq(users.id, orders.userId))
        .groupBy(users.id)
        .orderBy(desc(sum(orders.pricePaidInCents))),
    ]);

  const totalCustomers = totalCustomersResult;
  const totalUsers = totalUsersResult[0]?.count ?? 0;

  // Get purchases for each customer
  const customerPurchases = await Promise.all(
    customerList.map(async (customer) => {
      const purchases = await db
        .select({
          orderId: orders.id,
          productName: products.name,
          pricePaid: orders.pricePaidInCents,
          purchaseDate: orders.createdAt,
        })
        .from(orders)
        .innerJoin(products, eq(orders.productId, products.id))
        .where(eq(orders.userId, customer.userId))
        .orderBy(desc(orders.createdAt));
      return { ...customer, purchases };
    }),
  );

  // Calculate total lifetime value
  const totalLifetimeValue = customerList.reduce(
    (sum, c) => sum + Number(c.totalSpent ?? 0),
    0,
  );

  // Average customer value
  const avgCustomerValue =
    totalCustomers > 0 ? totalLifetimeValue / totalCustomers : 0;

  const stats = [
    {
      name: "Total Users",
      value: totalUsers.toString(),
      description: "All registered accounts",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
    },
    {
      name: "Paying Customers",
      value: totalCustomers.toString(),
      description: "Users with purchases",
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
      color: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/20",
    },
    {
      name: "Lifetime Value",
      value: formatCurrency(totalLifetimeValue),
      description: "Total customer spend",
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
      color: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
    },
    {
      name: "Avg Customer Value",
      value: formatCurrency(avgCustomerValue),
      description: "Per paying customer",
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
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Customer Database
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete customer profiles with purchase history.
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

      {/* CUSTOMERS TABLE */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            All Users
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            User accounts with their purchase history
          </p>
        </div>

        {customerPurchases.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground mb-1">
              No users yet
            </p>
            <p className="text-sm text-muted-foreground">
              Users will appear here once they sign up
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {customerPurchases.map((customer) => (
              <div
                key={customer.userId}
                className="p-6 hover:bg-secondary/20 transition-colors"
              >
                {/* Customer Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                      {customer.userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={customer.userImage}
                          alt={customer.userName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        customer.userEmail?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-foreground">
                          {customer.userName}
                        </h3>
                        {customer.userRole === "admin" && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {customer.userEmail}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {formatDate(customer.userCreatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-heading font-bold text-foreground">
                        {customer.totalOrders}
                      </p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-heading font-bold text-emerald-400">
                        {formatCurrency(Number(customer.totalSpent ?? 0))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Spent
                      </p>
                    </div>
                    {customer.lastOrderDate && (
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(new Date(customer.lastOrderDate))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last Order
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchases List */}
                {customer.purchases.length > 0 && (
                  <div className="mt-4 pl-16">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Purchase History
                    </p>
                    <div className="space-y-2">
                      {customer.purchases.map((purchase) => (
                        <div
                          key={purchase.orderId}
                          className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/50 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-primary"
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
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {purchase.productName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(purchase.purchaseDate)}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-emerald-400">
                            {formatCurrency(purchase.pricePaid)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customer.purchases.length === 0 && (
                  <div className="mt-4 pl-16">
                    <div className="flex items-center gap-2 text-muted-foreground">
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
                          d="M20 12H4"
                        />
                      </svg>
                      <span className="text-sm">No purchases yet</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
