import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const navItems = [
    {
      name: "Overview",
      href: "/admin",
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "Products",
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      name: "Sales",
      href: "/admin/orders",
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Customers",
      href: "/admin/users",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground font-sans selection:bg-purple-500/30">
      {/* SIDEBAR COMMAND DECK */}
      <aside className="w-full md:w-72 bg-card/50 border-b md:border-b-0 md:border-r border-border backdrop-blur-xl flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-white/10">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold tracking-tight text-foreground">
                Vault<span className="text-muted-foreground">Admin</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-500">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* User Profile Mini-Card */}
          <div className="rounded-lg bg-secondary/50 border border-white/5 p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate opacity-70">
                Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="px-2 text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-3">
            Management
          </p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/5"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive/50 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Store
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
