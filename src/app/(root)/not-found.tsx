"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground font-sans selection:bg-destructive/20 selection:text-destructive">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-destructive/5 blur-[120px] opacity-50" />
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px] [radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-8 group">
          <h1 className="absolute inset-0 flex items-center justify-center text-[8rem] md:text-[12rem] font-black tracking-tighter text-destructive/20 blur-2xl select-none animate-pulse">
            404
          </h1>
          {/* The Main Numbers */}
          <h1 className="relative text-[8rem] md:text-[12rem] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-foreground via-foreground/50 to-transparent leading-none select-none">
            404
          </h1>
          {/* Status Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 shadow-xl backdrop-blur-md">
            Signal Lost
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Coordinates Invalid.
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto font-light leading-relaxed">
            The digital asset you are attempting to locate has been moved to a
            secure vault or does not exist in this sector.
          </p>
        </div>

        {/* RECOVERY ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-bold bg-white text-black! hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/10"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Base
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="rounded-full px-8 py-6 text-base border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-foreground/20 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Trace Back
          </Button>
        </div>

        {/* AVAILABLE SECTORS */}
        <div className="pt-8 border-t border-border/50">
          <h3 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-6">
            Available Sectors
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Asset Store", href: "/" },
              { label: "My Vault", href: "/orders" },
              { label: "System Status", href: "#" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
