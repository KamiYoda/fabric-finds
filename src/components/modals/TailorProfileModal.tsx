import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "./Modal";
import { Button } from "../Button";
import {
  Star,
  CheckCircle2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { getTailorPortfolio, getTailorReviews } from "@/lib/api/tailors";
import type { Tailor } from "@/features/tailors/types";

const tabs = ["Overview", "Portfolio", "Reviews"] as const;
type Tab = (typeof tabs)[number];

interface PortfolioItem {
  id?: string;
  image_url?: string;
  caption?: string;
  title?: string;
  outfit_category?: { name: string };
  created_at?: string;
}

interface ReviewItem {
  reviewer_name?: string;
  reviewer_profile_photo?: string;
  rating: number;
  comment: string;
  created_at?: string;
}

interface TailorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailor: Tailor | undefined;
  onOrder: (tailor: Tailor) => void;
}

export function TailorProfileModal({
  isOpen,
  onClose,
  tailor,
  onOrder,
}: TailorProfileModalProps) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [portfolioPage, setPortfolioPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const {
    data: portfolioData = { items: [], pagination: null },
    isLoading: portfolioLoading,
  } = useQuery({
    queryKey: ["tailor-portfolio", tailor?.id, portfolioPage],
    queryFn: () => getTailorPortfolio(tailor!.id, portfolioPage),
    enabled: isOpen && tab === "Portfolio" && !!tailor,
  });

  const {
    data: reviewsData = { items: [], pagination: null },
    isLoading: reviewsLoading,
  } = useQuery({
    queryKey: ["tailor-reviews", tailor?.id, reviewsPage],
    queryFn: () => getTailorReviews(tailor!.id, reviewsPage),
    enabled: isOpen && tab === "Reviews" && !!tailor,
  });

  if (!tailor) return null;

  const tags = tailor.specialties ?? [];

  const handleOrder = () => {
    onOrder?.(tailor);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      footer={
        <Button
          variant="primary"
          className="w-full rounded-full"
          onClick={handleOrder}
        >
          <Plus size={16} /> Order
        </Button>
      }
    >
      {/* header */}
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
              <h2 className="font-display text-lg font-bold">{tailor.name}</h2>
              <p className="text-sm text-primary">{tailor.name}</p>
            </div>
            {tailor.verified && (
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                Verified <CheckCircle2 size={14} className="text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {tailor.bio ??
          "Experienced tailor with a passion for quality craftsmanship."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t: string) => (
          <button
            key={t}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tabs - Sticky */}
      <div className="sticky top-0 z-10 mt-5 flex gap-1 rounded-full bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
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

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="mt-5 max-h-96 overflow-y-auto"
        >
          {tab === "Overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <div className="inline-flex items-center gap-1 font-display text-xl font-bold text-primary">
                    <Star size={16} className="fill-accent text-accent" />{" "}
                    {tailor.rating}
                  </div>
                  <div className="text-xs text-primary">Customer Ratings</div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
                  <div>
                    <div className="font-display text-xl font-bold">
                      {tailor.completedOrders}
                    </div>
                    <div className="text-xs text-muted-foreground">Jobs</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="font-display text-xl font-bold">
                      {tailor.completion_rate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completion rate
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 rounded-2xl bg-primary/5 p-4 text-sm text-primary">
                <div>
                  {tailor.yearsExperience} years of tailoring experience
                </div>
                <div>{tailor.acceptance_rate}% order acceptance rate</div>
                <div>{tailor.completion_rate} order completion rate</div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">Location</h4>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {tailor.location}
                  </span>
                </div>
              </div>
            </div>
          )}

          {tab === "Portfolio" && (
            <div className="space-y-4">
              {portfolioLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Loading portfolio…
                </div>
              ) : portfolioData.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                  No portfolio items yet.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {portfolioData.items.map(
                      (item: PortfolioItem, i: number) => (
                        <div key={i} className="space-y-2">
                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=70"
                            }
                            alt=""
                            className="aspect-[16/10] w-full rounded-2xl object-cover"
                          />
                          <div className="space-y-1">
                            <p className="font-medium">
                              {item.caption || item.title || "Portfolio item"}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {item.outfit_category?.name || "Outfit"}
                              </span>
                              <span>
                                {item.created_at
                                  ? new Date(
                                      item.created_at,
                                    ).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {portfolioData.pagination && (
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <button
                        onClick={() =>
                          setPortfolioPage(Math.max(1, portfolioPage - 1))
                        }
                        disabled={portfolioPage === 1}
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-medium">
                        Page {portfolioData.pagination.current_page} of{" "}
                        {portfolioData.pagination.last_page}
                      </span>
                      <button
                        onClick={() => setPortfolioPage(portfolioPage + 1)}
                        disabled={
                          portfolioData.pagination.current_page <=
                          portfolioData.pagination.last_page
                        }
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="space-y-4">
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Loading reviews…
                </div>
              ) : reviewsData.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                  No reviews yet.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-primary p-5 text-center text-primary-foreground">
                    <div className="font-display text-2xl font-bold">
                      {tailor.rating}/5
                    </div>
                    <div className="mt-1 inline-flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i <= Math.round(tailor.rating)
                              ? "fill-accent text-accent"
                              : "fill-gray-400 text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-xs opacity-80">
                      {tailor.reviewCount} reviews
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviewsData.items.map((r: ReviewItem, i: number) => (
                      <div
                        key={i}
                        className="space-y-2 border-b border-border pb-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              r.reviewer_profile_photo ||
                              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=70"
                            }
                            alt={r.reviewer_name || "Reviewer"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-sm">
                                {r.reviewer?.first_name}{" "}
                                {r.reviewer?.last_name || "Anonymous"}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {r.created_at
                                  ? new Date(r.created_at).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={
                                    star <= r.rating
                                      ? "fill-accent text-accent"
                                      : "fill-gray-400 text-gray-400"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {r.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviewsData.pagination && (
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <button
                        onClick={() =>
                          setReviewsPage(Math.max(1, reviewsPage - 1))
                        }
                        disabled={reviewsPage === 1}
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-medium">
                        Page {reviewsData.pagination.current_page} of{" "}
                        {reviewsData.pagination.last_page}
                      </span>
                      <button
                        onClick={() => setReviewsPage(reviewsPage + 1)}
                        disabled={
                          reviewsPage >= reviewsData.pagination.last_page &&
                          reviewsData.pagination.next_page_url === null
                        }
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
