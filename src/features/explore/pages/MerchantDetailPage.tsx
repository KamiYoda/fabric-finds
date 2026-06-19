import { memo, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  BadgeCheck,
  Star,
  Plus,
  ChevronDown,
  X,
  ShoppingCart,
  Info,
} from "lucide-react";
import {
  getMerchant,
  type FabricProduct,
} from "../utils/mockFabricMerchants";
import {
  setActiveMerchant,
  addItem,
  removeItem,
  useFabricCart,
  cartTotal,
  cartItemCount,
  type FabricCartItem,
} from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";
import { MerchantProfileModal } from "../components/MerchantProfileModal";

type Tab = "catalog" | "about";

export const MerchantDetailPage = memo(() => {
  const { merchantId } = useParams({ strict: false }) as { merchantId: string };
  const navigate = useNavigate();
  const merchant = getMerchant(merchantId);
  const [tab, setTab] = useState<Tab>("catalog");
  const [saved, setSaved] = useState(false);
  const [activeProduct, setActiveProduct] = useState<FabricProduct | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const cart = useFabricCart();
  if (cart.merchantId !== merchantId) {
    setActiveMerchant(merchantId);
  }

  const itemsCount = cartItemCount(cart.items);
  const total = cartTotal(cart.items);

  if (!merchant) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Merchant not found.{" "}
        <Link to="/dashboard/explore" search={{ tab: "browse" }}>
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/dashboard/explore", search: { tab: "browse" } })}
          className="rounded-full p-2 hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold">Explore</h1>
      </div>

      {/* Merchant strip — in card */}
      <div className="mt-4 w-full rounded-3xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="h-12 w-12 shrink-0 overflow-hidden rounded-full"
            aria-label="View merchant profile"
          >
            <img
              src={merchant.image}
              alt={merchant.name}
              className="h-full w-full object-cover"
            />
          </button>
          <div className="min-w-0 flex-1">
            <button onClick={() => setProfileOpen(true)} className="text-left">
              <div className="flex items-center gap-1">
                <h2 className="truncate font-display text-base font-semibold">
                  {merchant.name}
                </h2>
                {merchant.verified && (
                  <BadgeCheck
                    size={15}
                    className="fill-primary text-primary-foreground"
                  />
                )}
              </div>
              {merchant.shopName && (
                <p className="text-xs font-medium text-primary">
                  {merchant.shopName}
                </p>
              )}
            </button>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span>{merchant.rating.toFixed(1)}</span>
              {merchant.reviewsCount != null && (
                <span>· {merchant.reviewsCount} reviews</span>
              )}
              <button
                onClick={() => setProfileOpen(true)}
                className="ml-1 text-xs font-medium text-primary hover:underline"
              >
                View profile
              </button>
            </div>
          </div>
          <button
            onClick={() => setSaved((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              saved
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Favourite"
          >
            <Heart size={16} className={saved ? "fill-current" : undefined} />
          </button>
        </div>
      </div>

      {/* Pill tabs */}
      <div className="mt-5 flex rounded-full bg-muted p-1 text-sm font-medium">
        {(
          [
            { k: "catalog" as const, label: "Product Catalog" },
            { k: "about" as const, label: "About this merchant" },
          ]
        ).map(({ k, label }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative flex-1 rounded-full px-4 py-2 transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="merchant-tab-pill"
                  className="absolute inset-0 rounded-full bg-card shadow-soft"
                />
              )}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Cart pill */}
      <AnimatePresence>
        {tab === "catalog" && itemsCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={() =>
              navigate({
                to: "/dashboard/explore/merchant/$merchantId/review",
                params: { merchantId },
              })
            }
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-foreground/70 p-2 text-left text-primary-foreground shadow-soft"
          >
            <div className="flex -space-x-2">
              {cart.items.slice(0, 2).map((i) => (
                <img
                  key={i.productId + i.colorId}
                  src={i.productImage}
                  alt=""
                  className="h-10 w-10 rounded-lg border-2 border-card object-cover"
                />
              ))}
            </div>
            <div className="flex-1 text-sm font-semibold">
              {itemsCount} item{itemsCount > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold underline-offset-2 hover:underline">
              View cart <ShoppingCart size={14} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content — in card */}
      <div className="mt-5 w-full rounded-3xl border border-border bg-card p-4 shadow-soft">
        {tab === "catalog" ? (
          <ul className="divide-y divide-border">
            {merchant.products?.map((p) => {
              const inCart = cart.items.find((i) => i.productId === p.id);
              return (
                <li key={p.id} className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveProduct(p)}
                      className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-semibold">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                      <div className="mt-2 flex items-end justify-between">
                        <span
                          className={`text-sm font-semibold ${inCart ? "text-muted-foreground line-through" : ""}`}
                        >
                          {formatNaira(p.pricePerYard)}/yard
                        </span>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveProduct(p)}
                              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                            >
                              {formatNaira(inCart.pricePerUnit * inCart.quantity)}
                              <ChevronDown size={12} />
                            </button>
                            <button
                              onClick={() => removeItem(p.id)}
                              className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                              aria-label="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveProduct(p)}
                            className="flex items-center gap-1 text-xs font-semibold text-primary"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded border border-primary">
                              <Plus size={12} />
                            </span>
                            Add <ChevronDown size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <AboutMerchant merchant={merchant} />
        )}
      </div>

      {/* Sticky order button */}
      <AnimatePresence>
        {itemsCount > 0 && tab === "catalog" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-30"
          >
            <button
              onClick={() =>
                navigate({
                  to: "/dashboard/explore/merchant/$merchantId/review",
                  params: { merchantId },
                })
              }
              className="flex items-center gap-2 rounded-full gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <ShoppingCart size={16} /> Order {formatNaira(total)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddToCartSheet
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAdd={(item) => {
          addItem(item);
          setActiveProduct(null);
        }}
      />

      <MerchantProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        merchant={merchant}
        onOrder={(m) => {
          setProfileOpen(false);
          navigate({
            to: "/dashboard/explore/merchant/$merchantId/",
            params: { merchantId: m.id },
          });
        }}
      />
    </div>
  );
});
MerchantDetailPage.displayName = "MerchantDetailPage";

function AboutMerchant({
  merchant,
}: {
  merchant: NonNullable<ReturnType<typeof getMerchant>>;
}) {
  const dist = merchant.reviewsDistribution;
  const totalReviews = dist
    ? Object.values(dist).reduce((a, b) => a + b, 0)
    : 0;
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{merchant.about}</p>
      {merchant.tags && (
        <div className="flex flex-wrap gap-2">
          {merchant.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/60 p-4">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-display text-lg font-bold text-primary">
              {merchant.rating.toFixed(1)}/5
            </span>
          </div>
          <div className="mt-1 text-xs font-medium text-primary">
            Customer Ratings
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-4">
          <div>
            <div className="font-display text-lg font-bold">
              {merchant.orders ?? 0}
            </div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </div>
          <div>
            <div className="font-display text-lg font-bold">
              {merchant.completionRate ?? 100}%
            </div>
            <div className="text-xs text-muted-foreground">
              Completion rate
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-primary/5 p-4 text-xs text-primary">
        {merchant.replyTime && <div>{merchant.replyTime}</div>}
        {merchant.avgDelivery && <div>{merchant.avgDelivery}</div>}
        {merchant.dressDelivery && <div>{merchant.dressDelivery}</div>}
      </div>

      <div>
        <h3 className="font-display text-base font-semibold">Reviews</h3>
        {merchant.reviewsAverage != null && (
          <div className="mt-2 rounded-2xl bg-primary p-5 text-center text-primary-foreground">
            <div className="font-display text-3xl font-bold">
              {merchant.reviewsAverage.toFixed(1)}/5
            </div>
            <div className="mt-1 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={
                    s <= Math.round(merchant.reviewsAverage ?? 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-primary-foreground/30"
                  }
                />
              ))}
            </div>
            <div className="mt-1 text-xs text-primary-foreground/70">
              {merchant.reviewsCount ?? 0} reviews
            </div>
          </div>
        )}

        {dist && (
          <div className="mt-3 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((s) => {
              const count = dist[s];
              const pct = totalReviews ? (count / totalReviews) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <span className="flex w-6 items-center gap-0.5">
                    {s}
                    <Star
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <ul className="mt-4 space-y-3">
          {merchant.reviews?.map((r) => (
            <li key={r.id} className="rounded-xl bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <img
                  src={r.authorAvatar}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {r.authorName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Star
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {r.rating.toFixed(1)}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AddToCartSheet({
  product,
  onClose,
  onAdd,
}: {
  product: FabricProduct | null;
  onClose: () => void;
  onAdd: (item: FabricCartItem) => void;
}) {
  const open = !!product;
  const [colorId, setColorId] = useState<string>("");
  const [qty, setQty] = useState(3);
  const [unit, setUnit] = useState<"Yards" | "Pieces">("Yards");

  useMemo(() => {
    if (product) {
      setColorId(product.colors[0]?.id ?? "");
      setQty(3);
      setUnit(product.unit ?? "Yards");
    }
  }, [product]);

  if (!product) return null;
  const color = product.colors.find((c) => c.id === colorId);
  const total = product.pricePerYard * qty;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-foreground/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-6 shadow-elegant"
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" />
            <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingCart size={18} />
            </div>
            <h3 className="mt-3 font-display text-xl font-bold">Add to cart</h3>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.colors.map((c) => {
                const active = c.id === colorId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    className={`overflow-hidden rounded-xl border-2 text-left transition ${
                      active ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={c.swatch}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="bg-card p-2 text-center text-xs font-medium">
                      {c.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                onClick={() =>
                  setUnit((u) => (u === "Yards" ? "Pieces" : "Yards"))
                }
                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
              >
                {unit} <ChevronDown size={14} />
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
                >
                  −
                </button>
                <span className="font-display text-xl font-bold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                onAdd({
                  productId: product.id,
                  productName: product.name,
                  productImage: product.images[0],
                  colorId: color?.id ?? "",
                  colorName: color?.name ?? "",
                  unit,
                  quantity: qty,
                  pricePerUnit: product.pricePerYard,
                })
              }
              className="mt-6 w-full rounded-2xl border-2 border-dashed border-primary-foreground/40 bg-primary py-3.5 font-semibold text-primary-foreground"
            >
              Add {formatNaira(total)}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
