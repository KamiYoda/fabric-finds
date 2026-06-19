import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/Button";
import { Star, CheckCircle2, MapPin, Plus } from "lucide-react";
import { MapView } from "@/components/MapView";
import type { Tailor, TailorReview } from "../types";

const TABS = ["Overview", "Portfolio", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=70",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=70",
  "https://images.unsplash.com/photo-1620019124678-d3e3a14f1c83?w=600&q=70",
  "https://images.unsplash.com/photo-1614093302611-8efc4de12407?w=600&q=70",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=70",
];

interface TailorProfileModalProps {
  open: boolean;
  onClose: () => void;
  tailor?: Tailor;
  onOrder?: () => void;
}

export const TailorProfileModal = memo(
  ({ open, onClose, tailor, onOrder }: TailorProfileModalProps) => {
    const [tab, setTab] = useState<Tab>("Overview");
    const [activeTag, setActiveTag] = useState("Modern");

    const handleTagClick = useCallback((tag: string) => {
      setActiveTag(tag);
    }, []);

    const handleTabClick = useCallback((newTab: Tab) => {
      setTab(newTab);
    }, []);

    if (!tailor) return null;

    const tags = ["Modern", "Men's fit", "Agbada specialist"];

    return (
      <Modal
        open={open}
        onClose={onClose}
        size="lg"
        footer={
          <Button
            variant="primary"
            className="w-full rounded-full"
            onClick={onOrder}
          >
            <Plus size={16} /> Order
          </Button>
        }
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <img
            src={
              tailor.avatar ??
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=70"
            }
            alt={tailor.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold">
                  {tailor.name}
                </h2>
                <p className="text-sm text-primary">{tailor.location}</p>
              </div>
              {tailor.verified && (
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  verified <CheckCircle2 size={14} className="text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {tailor.bio ??
            "About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary."}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-full bg-muted p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                tab === t
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-5"
          >
            {tab === "Overview" && <OverviewTab tailor={tailor} />}
            {tab === "Portfolio" && <PortfolioTab />}
            {tab === "Reviews" && <ReviewsTab />}
          </motion.div>
        </AnimatePresence>
      </Modal>
    );
  },
);

TailorProfileModal.displayName = "TailorProfileModal";

// Sub-components

const OverviewTab = memo(({ tailor }: { tailor: Tailor }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted/60 p-4">
          <div className="inline-flex items-center gap-1 font-display text-xl font-bold text-primary">
            <Star size={16} className="fill-accent text-accent" />{" "}
            {tailor.rating}/5
          </div>
          <div className="text-xs text-primary">Customer Ratings</div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
          <div>
            <div className="font-display text-xl font-bold">
              {tailor.completedOrders ?? 37}
            </div>
            <div className="text-xs text-muted-foreground">Jobs</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="font-display text-xl font-bold">97%</div>
            <div className="text-xs text-muted-foreground">
              {tailor?.completion_rate}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 rounded-2xl bg-primary/5 p-4 text-sm text-primary">
        <div>
          Typically replies between {tailor.responseTime ?? "10-15 minutes"}
        </div>
        <div>Average delivery timeline - 5-8 days</div>
        <div>Dress delivery after completion - 1 day</div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Location</h4>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} /> 3km away
          </span>
        </div>
        <MapView pins={3} height="h-48" />
      </div>
    </div>
  );
});

OverviewTab.displayName = "OverviewTab";

const PortfolioTab = memo(() => {
  return (
    <div className="space-y-4">
      <div>
        <img
          src={PORTFOLIO_IMAGES[0]}
          alt="Portfolio item"
          className="aspect-[16/10] w-full rounded-2xl object-cover"
        />
        <p className="mt-2 text-sm">
          Everybody loves jennifer men's outfit drama
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i}>
            <img
              src={PORTFOLIO_IMAGES[i]}
              alt={`Portfolio item ${i}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <p className="mt-2 text-sm">
              African cultural attire | Ebira itinochi fabric…
            </p>
          </div>
        ))}
      </div>
      <div>
        <img
          src={PORTFOLIO_IMAGES[3]}
          alt="Portfolio item"
          className="aspect-[16/10] w-full rounded-2xl object-cover"
        />
        <p className="mt-2 text-sm">
          The perfect combination of elegance 💗🥰. Bride @mhizqueenny
        </p>
      </div>
    </div>
  );
});

PortfolioTab.displayName = "PortfolioTab";

const ReviewsTab = memo(() => {
  const breakdown = [
    { stars: 5, count: 29, total: 37 },
    { stars: 4, count: 36, total: 37 },
    { stars: 3, count: 3, total: 37 },
    { stars: 2, count: 0, total: 37 },
    { stars: 1, count: 0, total: 37 },
  ];

  const reviews = [
    {
      name: "Abija Nkem",
      rating: 5.0,
      date: "3 days ago",
      text: "Freddy Han really blew my mind with his delivery. Never seen anytin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    },
    {
      name: "Prince Sharkiru",
      rating: 5.0,
      date: "3 days ago",
      text: "Freddy Han really blew my mind with his delivery. Never seen anytin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    },
    {
      name: "Prince Sharkiru",
      rating: 5.0,
      date: "3 days ago",
      text: "Freddy Han really blew my mind with his delivery. Never seen anytin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-primary p-5 text-center text-primary-foreground">
        <div className="font-display text-2xl font-bold">4.8/5</div>
        <div className="mt-1 inline-flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} className="fill-accent text-accent" />
          ))}
        </div>
        <div className="mt-1 text-xs opacity-80">37 reviews</div>
      </div>

      <div className="space-y-2">
        {breakdown.map((b) => (
          <div key={b.stars} className="flex items-center gap-3 text-xs">
            <span className="inline-flex w-6 items-center gap-0.5 font-semibold">
              {b.stars} <Star size={10} className="fill-accent text-accent" />
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(b.count / b.total) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <span className="w-6 text-right text-muted-foreground">
              {b.count}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="inline-flex items-center gap-1 text-[11px]">
                    <Star size={10} className="fill-accent text-accent" />{" "}
                    {r.rating.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">{r.date}</div>
            </div>
            <p className="rounded-2xl bg-muted/60 p-3 text-xs text-foreground/80">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

ReviewsTab.displayName = "ReviewsTab";
