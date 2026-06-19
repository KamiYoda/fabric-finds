import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Blobs } from "../components/Blobs";
import { AuthSide } from "./login";
import { sendAuthCode } from '@/lib/api/auth'

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — i-sew" }, { name: "description", content: "Recover your i-sew account password." }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await sendAuthCode({ identifier, type: "password_reset" });
      setMessage("Verification code sent. Use it on the reset password page.");
      setTimeout(() => navigate({ to: "/reset-password" }), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthSide />
      <div className="relative flex items-center justify-center px-6 py-10">
        <Blobs />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Link to="/"><Logo /></Link></div>
          <h1 className="font-display text-4xl font-bold">Forgot password</h1>
          <p className="mt-2 text-muted-foreground">Enter your email or phone to receive a reset code.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email or phone number"
              required
              placeholder="you@email.com"
              type="email"
              value={identifier}
              onChange={(event: any) => setIdentifier(event.target.value)}
            />
            {error ? <div className="text-sm text-destructive">{error}</div> : null}
            {message ? <div className="text-sm text-primary">{message}</div> : null}
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading || !identifier.trim()}>
              {loading ? "Sending code…" : "Send reset code"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
