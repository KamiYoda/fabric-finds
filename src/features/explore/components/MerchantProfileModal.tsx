import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/Button";
import {
  Star,
  BadgeCheck,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  Truck,
} from "lucide-react";
import type { FabricMerchant, FabricMerchantReview } from "../utils/mockFabricMerchants";

const tabs = ["Overview", "Products", "Reviews"] as const;
type Tab = (typeof tabs)[number];

interface MerchantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: FabricMerchant | undefined;
  onOrder: (merchant: FabricMerchant) => void;
}

export function MerchantProfileModal({
  isOpen,
  onClose,
  merchant,
  onOrder,
}: MerchantProfileModalProps) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [productPage, setProductPage] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(0);

  const PRODUCTS_PER_PAGE = 3;
  const REVIEWS_PER_PAGE = 3;

  if (!merchant) return null;

  const tags = merchant.tags ?? [];
  const products = merchant.products ?? [];
  const reviews = merchant.reviews ?? [];

  const pagedProducts = products.slice(
    productPage * PRODUCTS_PER_PAGE,
    (productPage + 1) * PRODUCTS_PER_PAGE,
  );
  const totalProductPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const pagedReviews = reviews.slice(
    reviewsPage * REVIEWS_PER_PAGE,
    (reviewsPage + 1) * REVIEWS_PER_PAGE,
  );
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const avgRating =
    merchant.reviewsAverage ??
    (reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : merchant.rating);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      footer={
        <Button
          variant="primary"
          className="w-full rounded-full"
          onClick={() => onOrder(merchant)}
        >
          <Plus size={16} /> Order from {merchant.name}
        </Button>
      }
    >
      {/* Header — mirrors TailorProfileModal */}
      <div className="flex items-start gap-4">
        <img
          src={merchant.image}
          alt={merchant.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold">{merchant.name}</h2>
              {merchant.shopName && (
                <p className="text-sm text-primary">{merchant.shopName}</p>
              )}
            </div>
            {merchant.verified && (
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                Verified <BadgeCheck size={14} className="fill-primary text-primary-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {merchant.bio ?? merchant.about ?? "Quality fabric merchant with a wide selection of materials."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t: string) => (
          <span
            key={t}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Tabs — Sticky, same as TailorProfileModal */}
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
          {/* Overview tab */}
          {tab === "Overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <div className="inline-flex items-center gap-1 font-display text-xl font-bold text-primary">
                    <Star size={16} className="fill-accent text-accent" />{" "}
                    {avgRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-primary">Customer Ratings</div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
                  <div>
                    <div className="font-display text-xl font-bold">
                      {merchant.orders ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="font-display text-xl font-bold">
                      {merchant.completionRate ?? 100}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completion
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 rounded-2xl bg-primary/5 p-4 text-sm text-primary">
                {merchant.replyTime && <div className="flex items-center gap-2"><Clock size={12} /> {merchant.replyTime}</div>}
                {merchant.avgDelivery && <div className="flex items-center gap-2"><Truck size={12} /> {merchant.avgDelivery}</div>}
                {merchant.dressDelivery && <div className="flex items-center gap-2"><Package size={12} /> {merchant.dressDelivery}</div>}
                {!merchant.replyTime && !merchant.avgDelivery && (
                  <div>Reliable merchant with consistent quality and delivery.</div>
                )}
              </div>

              {merchant.reviewsDistribution && (() => {
                const dist = merchant.reviewsDistribution!;
                const total = Object.values(dist).reduce((a, b) => a + b, 0);
                return (
                  <div>
                    <h4 className="mb-2 font-semibold text-sm">Rating breakdown</h4>
                    <div className="space-y-1.5">
                      {([5, 4, 3, 2, 1] as const).map((s) => {
                        const count = dist[s];
                        const pct = total ? (count / total) * 100 : 0;
                        return (
                          <div key={s} className="flex items-center gap-2 text-xs">
                            <span className="flex w-6 items-center gap-0.5">
                              {s}<Star size={10} className="fill-yellow-400 text-yellow-400" />
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-5 text-right text-muted-foreground">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Products tab */}
          {tab === "Products" && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                  No products listed yet.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {pagedProducts.map((p) => (
                      <div key={p.id} className="flex gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{p.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {p.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {p.colors.slice(0, 4).map((c) => (
                              <div
                                key={c.id}
                                className="h-4 w-4 rounded-full border border-border overflow-hidden"
                                title={c.name}
                              >
                                <img src={c.swatch} alt={c.name} className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-primary">
                            ₦{p.pricePerYard.toLocaleString("en-NG")}/yard
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalProductPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <button
                        onClick={() => setProductPage(Math.max(0, productPage - 1))}
                        disabled={productPage === 0}
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-medium">
                        Page {productPage + 1} of {totalProductPages}
                      </span>
                      <button
                        onClick={() => setProductPage(Math.min(totalProductPages - 1, productPage + 1))}
                        disabled={productPage >= totalProductPages - 1}
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

          {/* Reviews tab — mirrors TailorProfileModal */}
          {tab === "Reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                  No reviews yet.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-primary p-5 text-center text-primary-foreground">
                    <div className="font-display text-2xl font-bold">
                      {avgRating.toFixed(1)}/5
                    </div>
                    <div className="mt-1 inline-flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i <= Math.round(avgRating)
                              ? "fill-accent text-accent"
                              : "fill-gray-400 text-gray-400"
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-xs opacity-80">
                      {merchant.reviewsCount ?? reviews.length} reviews
                    </div>
                  </div>

                  <div className="space-y-4">
                    {pagedReviews.map((r: FabricMerchantReview) => (
                      <div key={r.id} className="space-y-2 border-b border-border pb-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={r.authorAvatar}
                            alt={r.authorName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-sm">{r.authorName}</div>
                              <span className="text-xs text-muted-foreground">{r.date}</span>
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
                            <p className="text-sm text-muted-foreground mt-2">{r.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalReviewPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <button
                        onClick={() => setReviewsPage(Math.max(0, reviewsPage - 1))}
                        disabled={reviewsPage === 0}
                        className="rounded-lg border border-border p-2 hover:bg-muted disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-medium">
                        Page {reviewsPage + 1} of {totalReviewPages}
                      </span>
                      <button
                        onClick={() => setReviewsPage(Math.min(totalReviewPages - 1, reviewsPage + 1))}
                        disabled={reviewsPage >= totalReviewPages - 1}
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
