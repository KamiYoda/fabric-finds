import { memo, useState, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { TailorCard } from "../components/TailorCard";
import { TailorProfileModal } from "../../../components/modals/TailorProfileModal";
import { getTailors } from "@/lib/api/tailors";
import type { Tailor } from "@/features/tailors/types";
import { MyTailorsCard } from "../components/MyTailorsCard";
import { MerchantsExploreSection } from "@/features/merchants";

type Tab = "browse" | "my" | "merchants";

const REGIONS = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"];

export const ExplorePage = memo(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [selectedTailor, setSelectedTailor] = useState<Tailor | undefined>(
    undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [region, setRegion] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [page, setPage] = useState(1);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleTailorClick = useCallback((tailor: Tailor) => {
    setSelectedTailor(tailor);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleOrderFromTailor = useCallback(
    (tailor: Tailor) => {
      router.navigate({
        to: "/dashboard/create",
        search: { tailor_id: tailor.id },
      });
    },
    [router],
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["tailors", { region, rating, page }],
    queryFn: async () => {
      const params: any = { per_page: 12, page };
      if (region) params.region = region;
      if (rating > 0) params.rating = rating;
      const res = await getTailors(params);
      return res;
    },
    enabled: activeTab === "browse",
    staleTime: 1000 * 60 * 5,
  });

  const { data: myTailorsResponse, isLoading: myTailorsLoading } = useQuery({
    queryKey: ["my-tailors"],
    queryFn: () => getTailors({ per_page: 50 }),
    enabled: activeTab === "my",
    staleTime: 1000 * 60 * 5,
  });

  const tailors = (Array.isArray(response) ? response : []) as Tailor[];
  const myTailors = (
    Array.isArray(myTailorsResponse) ? myTailorsResponse : []
  ) as Tailor[];

  return (
    <div className="mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Discover tailors</h1>
      </div>

      {/* Tabs - Sticky */}
      <div className="sticky top-16 z-10 mt-6 flex w-full  bg-muted p-1">
        {(["browse", "my"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="explore-tab"
                  className="absolute inset-0 rounded-full bg-card shadow-soft"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {tab === "browse" ? "Browse" : "My Tailors"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters - Sticky Browse tab only */}
      {activeTab === "browse" && (
        <div className="sticky top-28 z-10 mt-4 flex flex-wrap gap-3 bg-cream py-2">
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => {
              setRating(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>

          {(region || rating > 0) && (
            <button
              onClick={() => {
                setRegion("");
                setRating(0);
                setPage(1);
              }}
              className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="mt-6">
        {activeTab === "browse" ? (
          isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" /> Loading tailors…
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {tailors.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground col-span-full"
                  >
                    No tailors found matching your filters.
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {tailors.map((tailor, i) => (
                      <motion.div
                        key={tailor.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <TailorCard
                          tailor={tailor}
                          onClick={handleTailorClick}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {tailors.length > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium">Page {page}</span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={tailors.length < 12}
                    className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )
        ) : myTailorsLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading tailors…
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {myTailors.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
              >
                No saved tailors yet. Browse to find and save your favorite
                tailors.
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
              >
                {myTailors.map((tailor, i) => (
                  <motion.div
                    key={tailor.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <MyTailorsCard
                      tailor={tailor}
                      onClick={handleTailorClick}
                    />
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
        onOrder={handleOrderFromTailor}
      />
    </div>
  );
});

ExplorePage.displayName = "ExplorePage";
