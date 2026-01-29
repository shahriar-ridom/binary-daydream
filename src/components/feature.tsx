"use client";

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-6 lg:px-8 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Core Architecture
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-6">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/40">
              Velocity.
            </span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
            Our infrastructure is designed to eliminate friction. From payment
            to deployment in{" "}
            <span className="text-foreground font-medium">milliseconds</span>.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              title: "Instant Access",
              desc: "Zero latency. Automated key delivery immediately upon block confirmation.",
              iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              color: "text-amber-400",
              glow: "shadow-amber-500/20",
              bg: "bg-amber-500/10",
            },
            {
              title: "Commercial Rights",
              desc: "Unrestricted license. Build, ship, and monetize without legal bottlenecks.",
              iconPath:
                "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              color: "text-emerald-400",
              glow: "shadow-emerald-500/20",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Elite Quality",
              desc: "Manually audited assets. We filter the noise so you only get signal.",
              iconPath:
                "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
              color: "text-blue-400",
              glow: "shadow-blue-500/20",
              bg: "bg-blue-500/10",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative flex flex-col p-8 h-full rounded-4xl border border-white/5 bg-card/30 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:bg-card/50 hover:-translate-y-1"
            >
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 mb-8">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/5 ${item.bg} ${item.color} ${item.glow} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.iconPath}
                    />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 flex-1">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-light">
                  {item.desc}
                </p>
              </div>

              {/* Decorative Tech Lines */}
              <div className="absolute bottom-6 right-6 flex gap-1 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-foreground" />
                <div className="w-1 h-1 rounded-full bg-foreground" />
                <div className="w-1 h-1 rounded-full bg-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
