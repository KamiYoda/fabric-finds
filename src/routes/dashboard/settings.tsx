import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl px-4 py-8 sm:px-0">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The settings page is still being designed. Measurement profiles belong in their own workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/dashboard/measurements"
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Go to Measurements
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
