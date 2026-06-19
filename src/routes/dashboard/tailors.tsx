import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTailors } from "@/lib/api/tailors";
import type { Tailor } from "@/features/tailors/types";
import { TailorCard } from "@/features/explore/components/TailorCard";
import { TailorProfileModal } from "@/components/modals/TailorProfileModal";
import { Button } from "@/components/Button";

type TailorTab = "all" | "favorites";

const TABS: TailorTab[] = ["all", "favorites"];

const MyTailorsPage = memo(() => {
  const [tab, setTab] = useState<TailorTab>("all");
  const [selectedTailor, setSelectedTailor] = useState<Tailor | undefined>(
    undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabChange = useCallback((t: TailorTab) => setTab(t), []);

  const handleTailorClick = useCallback((tailor: Tailor) => {
    setSelectedTailor(tailor);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const {
    data: tailors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-tailors"],
    queryFn: async () => {
      try {
        // Fetch user's saved tailors - this will return data like explore page
        const response = await getTailors({ per_page: 50 });
        return Array.isArray(response) ? response : [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const allTailors = tailors;
  const favoriteTailors = tailors.filter((t) => t.verified);

  const filtered = tab === "favorites" ? favoriteTailors : allTailors;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">My tailors</h1>
        <Link to="/dashboard/explore">
          <Button variant="outline" size="sm">
            Find tailors
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="relative mt-6 flex w-full rounded-full bg-muted p-1">
        {TABS.map((t) => {
          const active = tab === t;
          const count =
            t === "favorites" ? favoriteTailors.length : allTailors.length;
          return (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tailors-tab"
                  className="absolute inset-0 rounded-full bg-card shadow-soft"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {t === "all" ? "All" : "Favorites"}
                {count > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-semibold text-primary">
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading tailors…
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
              >
                {tab === "favorites"
                  ? "No favorite tailors yet."
                  : "No saved tailors yet. Visit Explore to find tailors."}
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((tailor, i) => (
                  <motion.div
                    key={tailor.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <TailorCard tailor={tailor} onClick={handleTailorClick} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Tailor Profile Modal */}
      <TailorProfileModal
        tailor={selectedTailor}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
});

export const Route = createFileRoute("/dashboard/tailors")({
  component: MyTailorsPage,
});
