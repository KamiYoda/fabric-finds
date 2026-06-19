import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  CheckCircle2,
  Star,
  Loader2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getMerchant,
  listMerchantFabrics,
  listMerchantReviews,
} from "../api/mockMerchants";
import { useMerchantCart } from "../CartContext";
import { FabricRow } from "../components/FabricRow";
import { AddToCartModal } from "../components/AddToCartModal";
import { CartSummaryModal } from "../components/CartSummaryModal";
import { DeliveryInfoModal } from "../components/DeliveryInfoModal";
import type { Fabric } from "../types";

type Tab = "catalog" | "about";

interface Props {
  merchantId: string;
}

export function MerchantProfilePage({ merchantId }: Props) {
  const navigate = useNavigate();
  const cart = useMerchantCart();
  const [tab, setTab] = useState<Tab>("catalog");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState<boolean | undefined>(undefined);
  const [reviewsPage, setReviewsPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | undefined>();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const { data: merchant } = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => getMerchant(merchantId),
  });

  const { data: fabricsData, isLoading: fabricsLoading } = useQuery({
    queryKey: ["merchant-fabrics", merchantId, category, available, page],
    queryFn: () =>
      listMerchantFabrics(merchantId, {
        category: category || undefined,
        available,
        page,
        per_page: 12,
      }),
    enabled: tab === "catalog",
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["merchant-reviews", merchantId, reviewsPage],
    queryFn: () => listMerchantReviews(merchantId, reviewsPage, 10),
    enabled: tab === "about",
  });

  const cartItemMap = useMemo(() => {
    const m: Record<string, (typeof cart.items)[number]> = {};
    cart.items.forEach((i) => (m[i.fabricId] = i));
    return m;
  }, [cart.items]);

  const handleAdd = (fabric: Fabric) => {
    if (merchant) cart.setMerchant(merchant);
    setEditingFabric(fabric);
    setAddOpen(true);
  };

  const handleAddConfirm = (variantId: string, quantity: number) => {
    if (editingFabric) cart.addItem(editingFabric, variantId, quantity);
    setAddOpen(false);
  };

  const handleViewCart = () => setSummaryOpen(true);

  const handleSummaryContinue = () => {
    setSummaryOpen(false);
    setDeliveryOpen(true);
  };

  const handleDeliveryContinue = (mode: "tailor" | "self") => {
    setDeliveryOpen(false);
    if (mode === "tailor") {
      navigate({ to: "/dashboard/merchants/order/select-tailor" });
    } else {
      navigate({ to: "/dashboard/merchants/order/delivery-address" });
    }
  };

  if (!merchant) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <Loader2 className="mr-2 animate-spin" size={16} /> Loading merchant…
      </div>
    );
  }

  const categories = Array.from(new Set(merchant.specialties));

  return (
    <div className="mx-auto w-full max-w-2xl pb-32">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/explore"
          className="inline-flex items-center gap-2 font-display text-2xl font-bold"
        >
          <ArrowLeft size={20} /> Explore
        </Link>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <img
          src={merchant.avatar}
          alt={merchant.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate font-display font-bold">{merchant.name}</h2>
            {merchant.verified && (
              <CheckCircle2 size={14} className="text-primary" />
            )}
          </div>
          <p className="text-sm text-primary">{merchant.shop}</p>
        </div>
        <button className="rounded-full bg-primary/10 p-2 text-primary">
          <Heart size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-10 mt-5 flex bg-muted p-1 rounded-full">
        {(["catalog", "about"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 rounded-full px-4 py-2 text-sm font-medium ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="merchant-tab"
                  className="absolute inset-0 rounded-full bg-card shadow-soft"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {t === "catalog" ? "Product Catalog" : "About this merchant"}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-5"
        >
          {tab === "catalog" ? (
            <>
              {/* Cart pill */}
              {cart.items.length > 0 && (
                <button
                  onClick={handleViewCart}
                  className="mb-3 flex w-full items-center gap-2 rounded-xl bg-foreground/40 p-2 text-card"
                >
                  <div className="flex gap-1">
                    {cart.items.slice(0, 2).map((i) => (
                      <img
                        key={i.fabricId}
                        src={i.image}
                        alt={i.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ))}
                  </div>
                  <span className="flex-1 text-left text-sm font-semibold">
                    {cart.items.length} item
                    {cart.items.length === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1 pr-2 text-sm underline">
                    View cart <ShoppingCart size={14} />
                  </span>
                </button>
              )}

              {/* Filters */}
              <div className="mb-3 flex flex-wrap gap-2">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={available === undefined ? "" : String(available)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAvailable(v === "" ? undefined : v === "true");
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium"
                >
                  <option value="">Any availability</option>
                  <option value="true">In stock</option>
                  <option value="false">Out of stock</option>
                </select>
              </div>

              {fabricsLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  <Loader2 size={16} className="mr-2 animate-spin" /> Loading…
                </div>
              ) : !fabricsData || fabricsData.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                  No fabrics found matching your filters.
                </div>
              ) : (
                <div>
                  {fabricsData.items.map((f) => (
                    <FabricRow
                      key={f.id}
                      fabric={f}
                      cartItem={cartItemMap[f.id]}
                      onAdd={handleAdd}
                      onEdit={handleAdd}
                      onRemove={(id) => cart.removeItem(id)}
                    />
                  ))}

                  {fabricsData.total > fabricsData.perPage && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-border p-2 disabled:opacity-50"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-xs font-medium">Page {page}</span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * fabricsData.perPage >= fabricsData.total}
                        className="rounded-lg border border-border p-2 disabled:opacity-50"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">{merchant.bio}</p>
              <div className="flex flex-wrap gap-2">
                {merchant.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <div className="inline-flex items-center gap-1 font-display text-lg font-bold text-primary">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {merchant.rating}/5
                  </div>
                  <div className="text-xs text-primary">Customer Ratings</div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
                  <div>
                    <div className="font-display text-lg font-bold">
                      {merchant.ordersCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="font-display text-lg font-bold">
                      {merchant.completionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completion rate
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 rounded-2xl bg-primary/5 p-4 text-sm text-primary">
                <div>{merchant.replyTime}</div>
                <div>{merchant.deliveryTimeline}</div>
                <div>{merchant.dressDelivery}</div>
              </div>

              <h3 className="font-display font-bold">Reviews</h3>
              {reviewsLoading || !reviewsData ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  <Loader2 size={16} className="mr-2 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-primary p-5 text-center text-primary-foreground">
                    <div className="font-display text-2xl font-bold">
                      {reviewsData.average}/5
                    </div>
                    <div className="mt-1 inline-flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i <= Math.round(reviewsData.average)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-white/40 text-white/40"
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-xs opacity-80">
                      {reviewsData.total} reviews
                    </div>
                  </div>
                  <div className="space-y-2">
                    {reviewsData.ratingBreakdown.map((r) => {
                      const max = Math.max(
                        ...reviewsData.ratingBreakdown.map((x) => x.count),
                        1,
                      );
                      return (
                        <div key={r.stars} className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 w-8 text-sm font-medium">
                            {r.stars}
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${(r.count / max) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-sm text-muted-foreground">
                            {r.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-3">
                    {reviewsData.items.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl bg-muted/50 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={r.reviewerAvatar}
                            alt={r.reviewerName}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-sm">
                                {r.reviewerName}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {r.createdAt}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-0.5">
                              <Star
                                size={12}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span className="text-xs font-semibold">
                                {r.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {r.body}
                        </p>
                      </div>
                    ))}
                  </div>
                  {reviewsData.total > 10 && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          setReviewsPage(Math.max(1, reviewsPage - 1))
                        }
                        disabled={reviewsPage === 1}
                        className="rounded-lg border border-border p-2 disabled:opacity-50"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-xs font-medium">
                        Page {reviewsPage}
                      </span>
                      <button
                        onClick={() => setReviewsPage(reviewsPage + 1)}
                        disabled={reviewsPage * 10 >= reviewsData.total}
                        className="rounded-lg border border-border p-2 disabled:opacity-50"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating order CTA */}
      {cart.items.length > 0 && tab === "catalog" && (
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
          <button
            onClick={handleViewCart}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
          >
            <ShoppingCart size={16} /> Order ₦
            {cart.totalAmount.toLocaleString()}
          </button>
        </div>
      )}

      <AddToCartModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fabric={editingFabric}
        existingItem={
          editingFabric ? cartItemMap[editingFabric.id] : undefined
        }
        onConfirm={handleAddConfirm}
      />
      <CartSummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        onContinue={handleSummaryContinue}
      />
      <DeliveryInfoModal
        open={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
        onContinue={handleDeliveryContinue}
      />
    </div>
  );
}
