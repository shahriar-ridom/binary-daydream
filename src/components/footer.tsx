import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 xl:gap-0">
          {/* 1. BRAND INTELLIGENCE */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-xl font-heading font-bold tracking-tight text-foreground">
                  Shahriar<span className="text-muted-foreground">Assets</span>
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  EST. 2025 • DHAKA
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              High-fidelity digital instruments for the modern architect.
            </p>
          </div>

          {/* 2. NEWSLETTER (The "Alpha" Stream) */}
          <div className="w-full xl:w-auto">
            <form className="relative flex max-w-xs xl:max-w-sm w-full">
              <input
                type="email"
                required
                placeholder="Updates & Drops"
                className="w-full rounded-l-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="rounded-r-xl border-y border-r border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* 3. SYSTEM STATUS & LEGAL (The Fine Print) */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Operational Badge */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Systems Normal
            </span>
          </div>

          {/* Minimal Links */}
          <div className="flex gap-8">
            {["License", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Shahriar Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
