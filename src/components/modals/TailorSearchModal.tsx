import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { Search, Star, ChevronDown, ChevronRight, X, CheckCircle2, MapPin } from "lucide-react";
import { MapView } from "../MapView";

const TAILORS = [
  { id: "t1", initials: "FH", name: "Freddy Han", shop: "Freddy Fashion Fare", location: "Port Harcourt", rating: 5.0, orders: 25, completion: 100, distance: "1.2 km", verified: true, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=70" },
  { id: "t2", initials: "FU", name: "Fredrick Uzor", shop: "Uzor Bespoke", location: "Lagos", rating: 4.9, orders: 25, completion: 100, distance: "2.4 km", verified: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=70" },
  { id: "t3", initials: "WM", name: "Wilfried Mark", shop: "Mark Atelier", location: "Port Harcourt", rating: 5.0, orders: 25, completion: 100, distance: "0.8 km", verified: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70" },
  { id: "t4", initials: "KE", name: "Kunle Eze", shop: "Royal Stitches", location: "Lagos", rating: 4.8, orders: 412, completion: 96, distance: "3.1 km", verified: true, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=70" },
  { id: "t5", initials: "MA", name: "Maryam Ali", shop: "M.A. Couture", location: "Abuja", rating: 4.7, orders: 187, completion: 94, distance: "4.6 km", verified: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=70" },
];

const filters = [
  { key: "name", label: "By tailor's name" },
  { key: "location", label: "By location" },
  { key: "rating", label: "By best rated" },
] as const;
type FilterKey = typeof filters[number]["key"];

export function TailorSearchModal({ open, onClose, onSelect }: any) {
  const [filter, setFilter] = useState<FilterKey>("name");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [bidIndex, setBidIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => { if (!open) { setQuery(""); setBidIndex(null); } }, [open]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    let list = TAILORS.slice();
    if (filter === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (filter === "location") list = list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (!q) return list;
    if (filter === "name") return list.filter((t) => t.name.toLowerCase().includes(q));
    if (filter === "location") return list.filter((t) => t.location.toLowerCase().includes(q));
    return list.filter((t) => String(t.rating).includes(q));
  }, [debounced, filter]);

  const activeLabel = filters.find((f) => f.key === filter)!.label;

  return (
    <Modal open={open} onClose={onClose} title="Tailor search" size="lg">
      {/* Filter dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {activeLabel}
          <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
            >
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); setDropdownOpen(false); setQuery(""); }}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-muted ${filter === f.key ? "bg-primary/5 font-semibold text-primary" : ""}`}
                >
                  {f.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search input — hidden for "rating" (sort only) */}
      {filter !== "rating" && (
        <div className="relative mt-3">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={filter === "location" ? "Search by location" : "Search by tailor's name"}
            className={`h-12 w-full rounded-2xl border bg-muted/40 pl-11 pr-10 text-sm focus:outline-none focus:bg-card focus:ring-2 focus:ring-ring/30 ${query ? "border-primary/40 bg-card" : "border-transparent"}`}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Map view for location search */}
      {filter === "location" && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Searching <span className="font-semibold text-primary">online tailors</span>
            </span>
            <MapPin size={16} className="text-foreground" />
          </div>
          <div className="relative">
            <MapView pins={6} height="h-80" onPin={(i) => setBidIndex(i)} />
            {/* Bid card overlay */}
            <AnimatePresence>
              {bidIndex !== null && results[bidIndex % results.length] && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="absolute inset-x-3 top-3 rounded-2xl border border-border bg-card p-4 shadow-elegant"
                >
                  {(() => {
                    const t = results[bidIndex % results.length];
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 text-sm font-semibold">
                              {t.name} {t.verified && <CheckCircle2 size={14} className="text-primary" />}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {t.orders} orders · {t.completion}% completion
                            </div>
                            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px]">
                              <Star size={11} className="fill-accent text-accent" /> {t.rating.toFixed(1)}
                            </div>
                          </div>
                          <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
                            <div className="font-display text-sm font-bold text-primary">₦35,000</div>
                            <div className="text-[10px] text-muted-foreground">5-7 days</div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setBidIndex(null)}>Decline</Button>
                          <Button variant="primary" size="sm" className="flex-1" onClick={() => { setBidIndex(null); onSelect?.(t); }}>Accept</Button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Results list */}
      {(filter !== "location" || (filter === "location" && debounced)) && (
        <div className="mt-4">
          {filter === "name" && debounced && (
            <div className="mb-3 text-sm font-medium text-foreground">Tailors found</div>
          )}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No tailors match your search.
            </div>
          ) : (
            <div className="space-y-2">
              {(filter === "name" && !debounced ? [] : results).map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.03 }}
                  onClick={() => onSelect?.(t)}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-muted/50 p-3 text-left transition-all hover:bg-muted"
                >
                  <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-semibold">{t.name}</span>
                      {t.verified && <CheckCircle2 size={13} className="shrink-0 text-primary" />}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{t.location}</div>
                    <div className="mt-0.5 text-[11px] italic text-muted-foreground">
                      {t.orders} orders - {t.completion}% completion rate
                    </div>
                  </div>
                  {filter === "rating" ? (
                    <div className="inline-flex items-center gap-1 text-sm font-semibold">
                      <Star size={14} className="fill-accent text-accent" />
                      {t.rating.toFixed(1)}
                    </div>
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
