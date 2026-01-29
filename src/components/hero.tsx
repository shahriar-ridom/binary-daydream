export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background pt-40 md:pt-30">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-200 h-125 rounded-full bg-purple-600/20 blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[24px_24px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
          }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-in slide-in-from-top-4 duration-700 fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="tracking-wide">V 2.0 System Online</span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl font-heading font-extrabold tracking-tight text-foreground md:text-7xl lg:text-8xl animate-in zoom-in-50 duration-700 delay-150 fill-mode-forwards">
            Architect Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-foreground via-foreground to-muted-foreground">
              Digital Legacy.
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl font-light leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300 fill-mode-forwards">
            A curated arsenal of high-fidelity assets for the next generation of
            builders. Stop starting from scratch.{" "}
            <span className="text-foreground font-medium">
              Start from the finish line.
            </span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards">
            <a
              href="#browse"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <span>Access Vault</span>
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
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-linear-to-r from-transparent via-black/10 to-transparent" />
            </a>
          </div>

          {/* HUD STATS BAR */}
          <div className="mt-24 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-forwards">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden backdrop-blur-xl">
              {[
                { label: "Total Assets", value: "500+" },
                { label: "Downloads", value: "12.5K" },
                { label: "Uptime", value: "99.9%" },
                { label: "Rating", value: "5.0/5" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-background/80 p-6 hover:bg-secondary transition-colors group"
                >
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-bold text-foreground tracking-tight font-heading">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
