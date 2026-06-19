import { memo, useState, useCallback, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Heart } from "lucide-react";
import { TailorProfileModal } from "../../../components/modals/TailorProfileModal";
import { getTailors } from "@/lib/api/tailors";
import type { Tailor } from "@/features/tailors/types";
import { Route } from "@/routes/dashboard/explore/index";
import { TailorListCard } from "../components/TailorListCard";
import {
  FabricMerchantCard,
  FabricMerchantListCard,
} from "../components/FabricMerchantCard";
import {
  MOCK_FABRIC_MERCHANTS,
  type FabricMerchant,
} from "../utils/mockFabricMerchants";

// "browse" search param now backs the Fabric merchants tab; "my" backs Tailors.
type Tab = "browse" | "my";

export const ExplorePage = memo(() => {
  const router = useRouter();
  const { tab: initialTab } = Route.useSearch();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? "my");

  const [selectedTailor, setSelectedTailor] = useState<Tailor | undefined>(
    undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      setPage(1);
      setQuery("");
      router.navigate({
        to: "/dashboard/explore",
        search: { tab },
        replace: true,
      } as any);
    },
    [router],
  );

  const handleTailorClick = useCallback((tailor: Tailor) => {
    setSelectedTailor(tailor);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => setModalOpen(false), []);

  const handleBookTailor = useCallback(
    (tailor: Tailor) => {
      router.navigate({
        to: "/dashboard/create",
        search: { tailor_id: tailor.id, draft_id: undefined } as any,
      });
    },
    [router],
  );

  // Tailors data — used for the "Tailors" tab
  const { data: tailorsResponse, isLoading: tailorsLoading } = useQuery({
    queryKey: ["explore-tailors", { page }],
    queryFn: () => getTailors({ per_page: 12, page }),
    enabled: activeTab === "my",
    staleTime: 1000 * 60 * 5,
  });
  const tailors = (
    Array.isArray(tailorsResponse) ? tailorsResponse : []
  ) as Tailor[];

  const filteredTailors = useMemo(() => {
    let list = tailors;
    if (favouritesOnly) list = list.filter((t) => t.isSaved);
    if (query)
      list = list.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()),
      );
    return list;
  }, [tailors, favouritesOnly, query]);

  // Fabric merchants data — uses mock data (no API yet)
  const [savedMerchantIds, setSavedMerchantIds] = useState<Set<string>>(
    new Set(),
  );
  const merchants: FabricMerchant[] = useMemo(
    () =>
      MOCK_FABRIC_MERCHANTS.map((m) => ({
        ...m,
        isSaved: savedMerchantIds.has(m.id),
      })),
    [savedMerchantIds],
  );
  const filteredMerchants = useMemo(() => {
    let list = merchants;
    if (favouritesOnly) list = list.filter((m) => m.isSaved);
    if (query)
      list = list.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()),
      );
    return list;
  }, [merchants, favouritesOnly, query]);

  const toggleMerchantSaved = useCallback((id: string) => {
    setSavedMerchantIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="mx-auto w-full">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Explore</h1>

      {/* Tabs */}
      <div className="mt-4 flex w-full gap-6 border-b border-border text-sm font-medium">
        {(
          [
            { k: "my" as const, label: "Tailors" },
            { k: "browse" as const, label: "Fabric merchants" },
          ]
        ).map(({ k, label }) => {
          const active = activeTab === k;
          return (
            <button
              key={k}
              onClick={() => handleTabChange(k)}
              className={`relative pb-2.5 transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
              {active && (
                <motion.span
                  layoutId="explore-tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search + filter + favourites toggle */}
      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          aria-label="Filters"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal size={15} />
        </button>
        <button
          aria-label="Favourites"
          onClick={() => setFavouritesOnly((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            favouritesOnly
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart
            size={15}
            className={favouritesOnly ? "fill-current" : undefined}
          />
        </button>
      </div>

      {/* Favourites heading on Fabric merchants tab when filtering */}
      {activeTab === "browse" && favouritesOnly && (
        <h2 className="mt-4 text-sm font-semibold">Favourites Merchants</h2>
      )}

      {/* Content */}
      <div className="mt-4">
        {activeTab === "my" ? (
          tailorsLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" /> Loading tailors…
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTailors.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
                >
                  No tailors found.
                </motion.div>
              ) : (
                <motion.div layout className="grid gap-3">
                  {filteredTailors.map((tailor, i) => (
                    <motion.div
                      key={tailor.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <TailorListCard
                        tailor={tailor}
                        onViewProfile={handleTailorClick}
                        onBook={handleBookTailor}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )
        ) : favouritesOnly ? (
          <AnimatePresence mode="popLayout">
            {filteredMerchants.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
              >
                No favourite merchants yet.
              </motion.div>
            ) : (
              <motion.div layout className="grid gap-3">
                {filteredMerchants.map((m, i) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <FabricMerchantListCard
                      merchant={m}
                      onRemove={toggleMerchantSaved}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredMerchants.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
                >
                  No fabric merchants found.
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                >
                  {filteredMerchants.map((m, i) => (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <FabricMerchantCard
                        merchant={m}
                        onClick={() =>
                          router.navigate({
                            to: "/dashboard/explore/merchant/$merchantId" as any,
                            params: { merchantId: m.id } as any,
                          })
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {activeTab === "my" && filteredTailors.length > 0 && (
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
      </div>

      <TailorProfileModal
        tailor={selectedTailor}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onOrder={handleBookTailor}
      />
    </div>
  );
});

ExplorePage.displayName = "ExplorePage";
