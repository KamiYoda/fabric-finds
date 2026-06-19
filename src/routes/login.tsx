import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Blobs } from "../components/Blobs";
import heroImg from "../assets/tailor1.jpg";

import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

// enable small entry animations with framer-motion

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — i-sew" },
      { name: "description", content: "Sign in to your i-sew account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthSide />
      <div className="relative flex items-center justify-center px-6 py-10">
        <Blobs />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <h1 className="font-display text-4xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to continue your tailoring journey.
          </p>

          <button
            type="button"
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-all"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or{" "}
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email or phone number"
              required
              placeholder="you@email.com"
              type="email"
              value={identifier}
              onChange={(e: any) => setIdentifier(e.target.value)}
            />
            <Input
              label="Password"
              required
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : null}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-[oklch(0.34_0.15_264)]"
                />{" "}
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function AuthSide() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/95" />
      <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
        <Link to="/">
          <Logo className="text-primary-foreground" />
        </Link>
        <div>
          <h2 className="font-display text-5xl font-bold leading-tight">
            Custom tailoring,
            <br />
            <span className="text-accent italic">made personal.</span>
          </h2>
          <p className="mt-6 max-w-md text-primary-foreground/80">
            Join thousands of customers ordering bespoke outfits from verified
            master tailors.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Verified master tailors",
              "Secure escrow payments",
              "Real-time order tracking",
              "Free re-tailoring guarantee",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-accent text-primary">
                  <Check size={14} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-primary-foreground/60">
          © 2026 i-sew. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.5-1.7 13-4.7l-6-5.1c-1.9 1.4-4.3 2.3-7 2.3-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.1 16.2 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l6 5.1c-.4.4 6.7-4.9 6.7-14.4 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
