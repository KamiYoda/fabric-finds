import { memo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Paperclip,
  Mic,
  Send,
  Info,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { getMerchant } from "../utils/mockFabricMerchants";
import {
  useFabricCart,
  cartTotal,
  cartItemCount,
} from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";

interface Message {
  id: string;
  fromMe: boolean;
  body: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", fromMe: true, body: "Hi there", time: "09:41 am" },
  {
    id: "m2",
    fromMe: true,
    body: "How much will cover delivery?",
    time: "09:41 am",
  },
  { id: "m3", fromMe: false, body: "Hello", time: "09:41 am" },
  { id: "m4", fromMe: false, body: "One moment pls", time: "09:41 am" },
  {
    id: "m5",
    fromMe: false,
    body: "Dispatch is ₦3,500, should I proceed to set it?",
    time: "09:41 am",
  },
  {
    id: "m6",
    fromMe: true,
    body: "Alright pls do. Thank you.",
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

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const deliveryFee = 3500;

  if (!merchant) return null;

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        fromMe: true,
        body: draft.trim(),
        time: "09:41 am",
      },
    ]);
    setDraft("");
    // Simulate merchant confirming delivery once user replies
    setTimeout(() => setConfirmed(true), 600);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-2xl flex-col">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: ".." as any })}
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </button>
        <img
          src={merchant.image}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <h1 className="font-display text-lg font-bold">{merchant.name}</h1>
      </div>

      {/* Selections strip */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-foreground/70 p-2 text-primary-foreground">
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
        <button className="flex items-center gap-1 text-sm font-semibold">
          <ShoppingCart size={14} /> View selections
        </button>
      </div>

      {/* Delivery banner */}
      {!confirmed ? (
        <div className="mt-3 rounded-xl bg-muted/60 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground">
              Estimated Delivery
            </span>
            <span className="font-semibold">{formatNaira(4000)}</span>
          </div>
          <div className="mt-1 flex items-start gap-1.5 text-muted-foreground">
            <Info size={12} className="mt-0.5 shrink-0" /> Once the merchant
            confirms the delivery fee, you can proceed with payment.
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

      {/* Messages */}
      <div className="mt-4 flex-1 space-y-2 overflow-y-auto px-1 py-2">
        <div className="text-center text-[10px] uppercase tracking-wide text-muted-foreground">
          Today
        </div>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.fromMe
                  ? "bg-primary/10 text-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <div>{m.body}</div>
              <div className="mt-1 text-right text-[10px] text-muted-foreground">
                {m.time} ✓
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-card p-2">
        <button className="rounded-full p-1.5 text-muted-foreground">
          <Paperclip size={16} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type Message Here..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button className="rounded-full p-1.5 text-muted-foreground">
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
  );
});
MerchantChatPage.displayName = "MerchantChatPage";
