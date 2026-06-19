import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { listMerchants } from "../api/mockMerchants";
import { MerchantCard } from "../components/MerchantCard";
import type { Merchant } from "../types";

const CATEGORIES = ["Aso-oke", "Senator", "Lace", "Cashmere", "Ankara", "Adire"];

export function MerchantsExploreSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["merchants", { search, category, sort, page }],
    queryFn: () =>
      listMerchants({
        search: search || undefined,
        category: category || undefined,
        sort,
        page,
        per_page: 12,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const merchants = data?.items ?? [];

  const handleClick = (m: Merchant) => {
    navigate({ to: "/dashboard/merchants/$merchantId", params: { merchantId: m.id } });
  };

  return (
    <div>
      {/* Search & filters */}
      <div className="sticky top-28 z-10 mt-4 flex flex-wrap items-center gap-2 bg-cream py-2">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search merchants…"
            className="h-9 w-full rounded-lg border border-border bg-card pl-8 pr-3 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
        >
          <option value="rating">Top rated</option>
          <option value="orders">Most orders</option>
        </select>
        {(search || category) && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setPage(1);
            }}
            className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading merchants…
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {merchants.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
              >
                No merchants found matching your filters.
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {merchants.map((m, i) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <MerchantCard merchant={m} onClick={handleClick} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {merchants.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border p-2 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={merchants.length < 12}
              className="rounded-lg border border-border p-2 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
