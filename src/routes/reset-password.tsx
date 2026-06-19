import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Blobs } from "../components/Blobs";
import { AuthSide } from "./login";
import { resetPassword } from '@/lib/api/auth'

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — i-sew" }, { name: "description", content: "Reset your i-sew account password." }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(identifier, code, password, confirmPassword);
      setSuccess("Password reset successfully. Redirecting to login…");
      setTimeout(() => navigate({ to: "/login" }), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to reset password. Please try again.");
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
          <h1 className="font-display text-4xl font-bold">Reset password</h1>
          <p className="mt-2 text-muted-foreground">Enter your account details and the code sent to you.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email or phone number"
              required
              placeholder="you@email.com"
              type="email"
              value={identifier}
              onChange={(event: any) => setIdentifier(event.target.value)}
            />
            <Input
              label="Verification code"
              required
              placeholder="Enter code"
              value={code}
              onChange={(event: any) => setCode(event.target.value)}
            />
            <Input
              label="New password"
              required
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(event: any) => setPassword(event.target.value)}
            />
            <Input
              label="Confirm password"
              required
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(event: any) => setConfirmPassword(event.target.value)}
            />
            {error ? <div className="text-sm text-destructive">{error}</div> : null}
            {success ? <div className="text-sm text-primary">{success}</div> : null}
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading || !identifier.trim() || !code.trim() || !password || !confirmPassword}>
              {loading ? "Resetting password…" : "Reset password"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Back to <Link to="/login" className="font-semibold text-primary hover:underline">sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
