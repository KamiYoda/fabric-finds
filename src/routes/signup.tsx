import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Blobs } from "../components/Blobs";
import { AuthSide } from "./login";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { sendAuthCode, verifyAuthCode, register, getProfile } from "@/lib/api/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";

// using framer-motion for subtle entry animations

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — i-sew" },
      { name: "description", content: "Create your i-sew account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [pw, setPw] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [region, setRegion] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const expiryRef = useRef<number | null>(null);
  const verifyInFlight = useRef(false);

  const checks = useMemo(
    () => ({
      len: pw.length >= 8 && pw.length <= 16,
      num: /\d/.test(pw),
      up: /[A-Z]/.test(pw),
      low: /[a-z]/.test(pw),
    }),
    [pw],
  );

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!agreed) return;

    // If code not sent yet, send it first
    if (!codeSent) {
      if (!identifier.trim()) {
        setError("Please provide an email or phone number");
        return;
      }
      if (identifierError) {
        setError(identifierError);
        return;
      }
      await sendCode();
      return;
    }

    // If code already sent, verify and register
    if (!verified) {
      setError("You must verify the 6-digit code before creating an account.");
      return;
    }

    setLoading(true);
    try {
      const resp = await register({
        first_name: firstName,
        last_name: lastName,
        region: region || "Unknown",
        identifier: identifier.trim(),
        verification_code: code.trim(),
        password: pw,
      });
      setMessage("Account created — signing in...");
      // Load user profile after registration
      try {
        await getProfile();
      } catch (e) {
        console.warn("Profile load after signup failed:", e);
      }
      // respond to token if present (auth.setAuthToken already called in register), navigate
      setTimeout(() => navigate({ to: "/dashboard" }), 700);
      return resp;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  // Validate identifier (simple email check if it looks like an email)
  useEffect(() => {
    setIdentifierError(null);
    if (!identifier) return;
    if (identifier.includes("@")) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(identifier.trim())) {
        setIdentifierError("Please enter a valid email address");
      }
    }
  }, [identifier]);

  // countdown timer for code expiry
  useEffect(() => {
    if (!expiryRef.current) return;
    let timerId: any = null;
    const tick = () => {
      const left = expiryRef.current! - Date.now();
      if (left <= 0) {
        setTimeLeft(0);
        expiryRef.current = null;
        setCodeSent(false);
        setVerified(false);
        if (timerId) clearInterval(timerId);
        return;
      }
      setTimeLeft(left);
    };
    timerId = setInterval(tick, 1000);
    tick();
    return () => timerId && clearInterval(timerId);
  }, [codeSent]);

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (!codeSent) return;
    if (verified) return;
    const v = code.trim();
    if (v.length === 6 && !verifyInFlight.current) {
      verifyInFlight.current = true;
      (async () => {
        setError(null);
        try {
          await verifyAuthCode({
            identifier: identifier.trim(),
            code: v,
          });
          setVerified(true);
          setMessage("Code verified");
        } catch (err: unknown) {
          setVerified(false);
          setError(err instanceof Error ? err.message : "Invalid code");
        } finally {
          verifyInFlight.current = false;
        }
      })();
    }
  }, [code, codeSent, identifier, verified]);

  async function sendCode() {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await sendAuthCode({
        identifier: identifier.trim(),
        type: "registration",
      });
      setCodeSent(true);
      setVerified(false);
      setMessage("Verification code sent — check your inbox or SMS");
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      expiryRef.current = expiry;
      setTimeLeft(expiry - Date.now());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to send verification code",
      );
    } finally {
      setLoading(false);
    }
  }

  function formatTimeLeft(ms: number | null) {
    if (!ms || ms <= 0) return "00:00";
    const s = Math.floor(ms / 1000);
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  }

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
          <h1 className="font-display text-4xl font-bold">Welcome</h1>
          <p className="mt-2 text-muted-foreground">
            Create your account in under a minute.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                required
                placeholder="Johan"
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                required
                placeholder="Yesuf"
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                <span className="mr-0.5 text-accent">*</span>Region
              </label>
              <select
                value={region}
                onChange={(e: any) => setRegion(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Select region</option>
                <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                <option value="Accra, Ghana">Accra, Ghana</option>
                <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                <option value="London, UK">London, UK</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <span className="mr-0.5 text-accent">*</span>Email or phone
                number
              </label>
              <div className="relative flex items-center">
                <Input
                  required
                  placeholder="you@email.com"
                  type="text"
                  value={identifier}
                  onChange={(e: any) => setIdentifier(e.target.value)}
                  error={identifierError ?? undefined}
                  className="pr-28"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  {codeSent && timeLeft !== null && (
                    <div className="text-xs text-muted-foreground mr-2">
                      {formatTimeLeft(timeLeft)}
                    </div>
                  )}
                  {!codeSent ? (
                    <button
                      type="button"
                      onClick={async () => await sendCode()}
                      disabled={
                        !identifier || Boolean(identifierError) || loading
                      }
                      className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-primary hover:opacity-90 disabled:opacity-50"
                    >
                      Send code
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => await sendCode()}
                      disabled={loading}
                      className="rounded-xl bg-card px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                    >
                      Resend
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Input
              label="Create password"
              required
              placeholder="••••••••"
              type="password"
              value={pw}
              onChange={(e: any) => setPw(e.target.value)}
            />

            <ul className="grid grid-cols-2 gap-2 text-xs">
              {[
                { ok: checks.len, label: "8-16 characters" },
                { ok: checks.num, label: "At least 1 number" },
                { ok: checks.up, label: "1 upper case letter" },
                { ok: checks.low, label: "1 lower case letter" },
              ].map((c) => (
                <li
                  key={c.label}
                  className={`flex items-center gap-1.5 ${c.ok ? "text-primary" : "text-muted-foreground"}`}
                >
                  <CheckCircle2
                    size={14}
                    className={
                      c.ok ? "fill-primary text-primary-foreground" : ""
                    }
                  />
                  {c.label}
                </li>
              ))}
            </ul>

            {codeSent && (
              <div className="relative">
                <Input
                  label="Verification code"
                  required
                  placeholder="123456"
                  value={code}
                  onChange={(e: any) => setCode(e.target.value)}
                  className="pr-11"
                />
                {verified && (
                  <CheckCircle2
                    size={20}
                    className="absolute right-3 top-9 text-primary"
                  />
                )}
              </div>
            )}

            <label className="mt-2 flex items-start gap-2.5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-[oklch(0.34_0.15_264)]"
              />
              <span>
                I have read and agreed to i-sew's{" "}
                <a href="#" className="font-semibold text-primary underline">
                  terms of service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-primary underline">
                  privacy policy
                </a>
                .
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!agreed || loading}
            >
              {loading ? (
                codeSent ? (
                  "Verifying…"
                ) : (
                  "Sending code…"
                )
              ) : codeSent ? (
                <>
                  Create account <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Send verification code <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
