import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/features/explore";

export const Route = createFileRoute("/dashboard/explore/")({
  component: ExplorePage,
  validateSearch: (s: Record<string, unknown>) => ({
    tab: (s.tab === "my" ? "my" : "browse") as "browse" | "my",
  }),
});
