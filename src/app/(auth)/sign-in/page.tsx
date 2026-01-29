"use client";

import { signIn, signUp } from "@/lib/auth-client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// ------------------------------------------------------------------
// THE FORM COMPONENT
// ------------------------------------------------------------------
function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/orders";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn.email(
          {
            email,
            password,
            callbackURL: callbackUrl,
          },
          {
            onError: (ctx) => {
              setLoading(false);
              toast.error("Access Denied", { description: ctx.error.message });
            },
            onSuccess: () => {
              toast.success("Identity Verified", {
                description: "Welcome back to the vault.",
              });
              router.push(callbackUrl);
            },
          },
        );
      } else {
        await signUp.email(
          {
            email,
            password,
            name,
            callbackURL: callbackUrl,
          },
          {
            onError: (ctx) => {
              setLoading(false);
              toast.error("Registration Failed", {
                description: ctx.error.message,
              });
            },
            onSuccess: () => {
              toast.success("Account Created", {
                description: "Initiating system access...",
              });
              router.push(callbackUrl);
            },
          },
        );
      }
    } catch (err) {
      setLoading(false);
      toast.error("System Error", {
        description: err + ". Please try again later.",
      });
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-500 fade-in">
      {/* BRAND HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary mb-6 shadow-lg shadow-white/10">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
          {isSignIn ? "Authenticate" : "Initialize Protocol"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground font-light">
          {isSignIn
            ? "Enter your credentials to access the vault."
            : "Secure your digital assets today."}
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
        {/* Toggle Switch */}
        <div className="grid grid-cols-2 gap-1 p-1 mb-8 rounded-xl bg-secondary/50 border border-white/5">
          <button
            onClick={() => setIsSignIn(true)}
            className={`
                py-2 text-sm font-bold rounded-lg transition-all duration-300
                ${isSignIn ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`
                py-2 text-sm font-bold rounded-lg transition-all duration-300
                ${!isSignIn ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {!isSignIn && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Identity Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-white text-primary-foreground! px-4 py-3.5 text-sm font-bold shadow-lg shadow-white/5 hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-black" />
            ) : (
              <>
                <span>{isSignIn ? "Access Vault" : "Create Account"}</span>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground/40">
        Secure Connection • 256-bit Encryption
      </p>
    </div>
  );
}

// ------------------------------------------------------------------
// THE PAGE WRAPPER
// ------------------------------------------------------------------
export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-150 w-150 rounded-full bg-purple-900/20 blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] h-150 w-150 rounded-full bg-indigo-900/20 blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <Suspense
        fallback={
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
              Initializing...
            </p>
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </div>
  );
}
