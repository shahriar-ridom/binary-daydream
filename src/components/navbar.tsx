"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMobileMenuOpen(false);
          router.push("/");
        },
      },
    });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    // Custom Condition. If the User is admin, then there is no need for Orders page. It will show Admin page Instead
    ...(session && (session.user as { role?: string }).role !== "admin"
      ? [{ name: "Orders", href: "/orders" }]
      : []),
    ...(session && (session.user as { role?: string }).role === "admin"
      ? [{ name: "Admin", href: "/admin" }]
      : []),
    { name: "About", href: "/about" },
    ...(!session ? [{ name: "Login", href: "/sign-in" }] : []),
  ];

  return (
    <>
      {/* --- DESKTOP --- */}
      <div
        id="navbar-pill"
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 pointer-events-none transition-all duration-500"
      >
        <nav
          className={`
            pointer-events-auto flex items-center justify-between gap-4 md:gap-8
            rounded-full border px-4 py-2 md:px-6 md:py-3
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              scrolled
                ? "bg-background/80 border-border shadow-2xl shadow-primary/5 backdrop-blur-xl w-full max-w-5xl"
                : "bg-secondary/30 border-white/5 backdrop-blur-sm w-full max-w-4xl"
            }
          `}
        >
          {/* BRAND IDENTITY */}
          <Link
            href="/"
            className="flex items-center gap-2 group relative z-50 shrink-0 mr-auto md:mr-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
              <svg
                className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="block text-sm font-heading font-bold tracking-tight text-foreground">
              Shahriar<span className="text-muted-foreground">Assets</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-white/5 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ACTION AREA */}
          <div className="flex items-center gap-2 sm:gap-3 z-50 shrink-0">
            {/* CTA Button */}
            <Link
              href="/store"
              className="group cursor-pointer relative hidden sm:inline-flex items-center justify-center rounded-full bg-primary px-4 sm:px-5 py-2 text-xs font-bold whitespace-nowrap text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/10"
            >
              <span>Browse Vault</span>
              <svg
                className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1"
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

            {/* LOGOUT BUTTON (Only if Session exists) */}
            {session && (
              <button
                onClick={handleLogout}
                className="hidden cursor-pointer hover:scale-105 sm:flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 border border-white/5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all duration-300"
                title="Disconnect"
              >
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col items-center justify-center space-y-8 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-[-20%] right-[-20%] h-125 w-125 rounded-full bg-primary/20 blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-20%] h-125 w-125 rounded-full bg-secondary/40 blur-[120px] opacity-30" />

        {/* Mobile Links */}
        <div className="flex flex-col items-center gap-8 text-center relative z-10 w-full px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-heading font-bold text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 tracking-tight"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Actions */}
          <div className="w-full h-px bg-border my-4" />

          <Link
            href="/#browse"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full max-w-xs px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-2xl hover:bg-primary/90 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <span>Browse Vault</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          {/* Show SignOut if Logged In */}
          {session && (
            <button
              onClick={handleLogout}
              className="w-full max-w-xs px-8 py-4 bg-secondary/50 border border-white/5 text-destructive text-lg font-bold rounded-2xl hover:bg-destructive/10 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span>Disconnect</span>
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Footer Status */}
        <div className="absolute bottom-10 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Operational</span>
        </div>
      </div>
    </>
  );
}
