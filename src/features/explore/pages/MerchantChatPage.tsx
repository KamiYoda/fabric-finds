import { memo, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Paperclip,
  Mic,
  Send,
  Info,
  ArrowRight,
  X,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getMerchant } from "../utils/mockFabricMerchants";
import { useFabricCart, cartTotal, cartItemCount } from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";

interface Message {
  id: string;
  from: "me" | "merchant";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", from: "me", text: "Hi there", time: "09:41 am" },
  {
    id: "m2",
    from: "me",
    text: "How much will cover delivery?",
    time: "09:41 am",
  },
  { id: "m3", from: "merchant", text: "Hello", time: "09:41 am" },
  { id: "m4", from: "merchant", text: "One moment pls", time: "09:41 am" },
  {
    id: "m5",
    from: "merchant",
    text: "Dispatch is ₦3,500, should I proceed to set it?",
    time: "09:41 am",
  },
  {
    id: "m6",
    from: "me",
    text: "Alright pls do. Thank you.",
    time: "09:41 am",
  },
];

export const MerchantChatPage = memo(() => {
  const { merchantId } = useParams({ strict: false }) as { merchantId: string };
  const navigate = useNavigate();
  const merchant = getMerchant(merchantId);
  const cart = useFabricCart();
  const itemsCount = cartItemCount(cart.items);
  const total = cartTotal(cart.items);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [selectionsOpen, setSelectionsOpen] = useState(false);
  const deliveryFee = 3500;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!merchant) return null;

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        from: "me",
        text: draft.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
    setTimeout(() => setConfirmed(true), 600);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={() => navigate({ to: ".." as any })}
          className="rounded-full p-1.5 hover:bg-muted"
        >
          <ArrowLeft size={18} />
        </button>
        <img
          src={merchant.image}
          alt={merchant.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-base font-semibold">
            {merchant.name}
          </div>
          {merchant.shopName && (
            <div className="text-xs text-muted-foreground">
              {merchant.shopName}
            </div>
          )}
        </div>
      </div>

      {/* Selections strip */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setSelectionsOpen(true)}
          className="flex w-full items-stretch gap-2 rounded-2xl bg-foreground/70 p-1 text-left text-primary-foreground"
        >
          <div className="flex gap-1.5 p-1">
            {cart.items.slice(0, 2).map((i) => (
              <div
                key={i.productId + i.colorId}
                className="h-14 w-12 shrink-0 overflow-hidden rounded-lg"
              >
                <img
                  src={i.productImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-between rounded-xl bg-foreground/40 px-4 py-2">
            <div>
              <div className="font-semibold">
                {itemsCount} item{itemsCount > 1 ? "s" : ""}
              </div>
              <div className="text-xs text-primary-foreground/70">
                View selections
              </div>
            </div>
            <ChevronRight size={16} />
          </div>
        </button>

        {/* Delivery banner / pay CTA */}
        {!confirmed ? (
          <div className="mt-3 rounded-xl bg-muted/60 px-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">
                Estimated Delivery
              </span>
              <span className="font-semibold">{formatNaira(4000)}</span>
            </div>
            <div className="mt-1.5 flex items-start gap-1.5 text-muted-foreground">
              <Info size={12} className="mt-0.5 shrink-0" />
              Once the merchant confirms the delivery fee, you can proceed with
              payment.
            </div>
          </div>
        ) : (
          <button
            onClick={() =>
              navigate({
                to: "/dashboard/explore/merchant/$merchantId/pay" as any,
                params: { merchantId } as any,
                search: { delivery: deliveryFee } as any,
              })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-foreground"
          >
            Pay {formatNaira(total)} + {formatNaira(deliveryFee)}{" "}
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto px-4 py-4"
      >
        <div className="text-center text-[10px] uppercase tracking-wide text-muted-foreground">
          Today
        </div>
        {messages.map((m) => {
          const isMe = m.from === "me";
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div
                  className={`mt-1 text-right text-[10px] ${
                    isMe
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.time} ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background p-2">
          <button className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
            <Paperclip size={16} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type Message Here..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
            <Mic size={16} />
          </button>
          <button
            onClick={send}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Selections sheet */}
      <AnimatePresence>
        {selectionsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectionsOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-card p-5 shadow-elegant"
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">
                    Selected materials
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {itemsCount} item{itemsCount > 1 ? "s" : ""} ·{" "}
                    {formatNaira(total)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectionsOpen(false)}
                  className="rounded-full p-2 hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <ul className="mt-4 divide-y divide-border">
                {cart.items.map((item) => (
                  <li
                    key={item.productId + item.colorId}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-sm">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.colorName} · {item.quantity} {item.unit}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-primary">
                        {formatNaira(item.pricePerUnit)}/
                        {item.unit === "Yards" ? "yard" : "piece"}
                      </p>
                    </div>
                    <div className="shrink-0 font-display text-sm font-bold tabular-nums">
                      {formatNaira(item.pricePerUnit * item.quantity)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                <span className="text-sm font-semibold">Subtotal</span>
                <span className="font-display font-bold text-primary">
                  {formatNaira(total)}
                </span>
              </div>

              <button
                onClick={() => setSelectionsOpen(false)}
                className="mt-3 w-full rounded-2xl border-2 border-dashed border-primary/30 bg-primary/10 py-3 text-sm font-semibold text-primary"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
MerchantChatPage.displayName = "MerchantChatPage";
