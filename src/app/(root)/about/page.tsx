import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Assets Delivered", value: "12.5K+" },
    { label: "Active Creators", value: "3,200+" },
    { label: "Countries Served", value: "89" },
    { label: "Uptime Record", value: "99.9%" },
  ];

  const values = [
    {
      title: "Quality Over Quantity",
      description:
        "Every asset is manually reviewed and tested. We believe in curated excellence, not mass production.",
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/20",
    },
    {
      title: "Creator-First Philosophy",
      description:
        "Built by creators, for creators. We understand your workflow because we live it every day.",
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
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
    },
    {
      title: "Unrestricted Licensing",
      description:
        "Full commercial rights with every purchase. No hidden fees, no attribution required, no limits.",
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
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
      color: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
    },
    {
      title: "Instant Delivery",
      description:
        "Zero waiting. Your purchases are delivered instantly via secure, encrypted download links.",
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
    },
  ];

  const team = [
    {
      role: "Platform Architecture",
      description:
        "Engineered for scale. Our infrastructure handles millions of requests while maintaining sub-100ms response times.",
    },
    {
      role: "Asset Curation",
      description:
        "Every asset undergoes rigorous quality testing and real-world application trials before approval.",
    },
    {
      role: "Community Support",
      description:
        "24/7 dedicated support team ensuring you're never blocked. Average response time under 2 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-200 w-200 rounded-full bg-purple-900/20 blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] h-200 w-200 rounded-full bg-indigo-900/20 blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] invert-0" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-40 pb-20 px-6 lg:px-8 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center animate-in fade-in duration-700">
              <span className="mb-6 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mission Control
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-foreground via-muted-foreground to-muted mb-8">
                Built for Builders
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                We&apos;re not just a marketplace. We&apos;re a movement to
                democratize high-quality digital assets and accelerate the
                creative process for{" "}
                <span className="text-foreground font-medium">
                  every creator
                </span>
                .
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border backdrop-blur-xl">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-background/80 p-8 hover:bg-secondary transition-colors group"
                >
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl font-bold text-foreground tracking-tight font-heading">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Our Origin
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-6">
                Why We Exist
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                We built this platform after experiencing the same frustration
                every creator faces:{" "}
                <span className="text-foreground font-medium">
                  finding quality digital assets shouldn&apos;t be harder than
                  building the product itself
                </span>
                .
              </p>
              <p>
                The market was flooded with low-quality assets, complicated
                licensing, and predatory pricing models. We wanted something
                different—a place where creators could find premium assets,
                download instantly, and build without legal concerns.
              </p>
              <p className="text-foreground font-medium">
                So we built it ourselves.
              </p>
              <p>
                Today, we serve thousands of creators across 89 countries,
                delivering everything from UI kits to code templates to design
                systems. Every asset is vetted, every license is clear, and
                every purchase supports the creator economy.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="py-24 px-6 lg:px-8 bg-secondary/20 border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Core Principles
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-6">
                What We Stand For
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                These aren&apos;t just words on a page. They&apos;re the
                foundation of every decision we make.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl border border-border bg-card p-8 overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-xl"
                >
                  <div
                    className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${value.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${value.color} text-white shadow-lg mb-6`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Operations
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-6">
                How We Operate
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 hover:bg-card transition-colors"
                >
                  <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                    {item.role}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Join the Movement
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-6">
              Ready to Build Faster?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Join thousands of creators who ship products faster with our
              curated asset library.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/store"
                className="group inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <span>Browse Assets</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-border bg-secondary/50 px-8 py-4 font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-secondary hover:border-border/80"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
