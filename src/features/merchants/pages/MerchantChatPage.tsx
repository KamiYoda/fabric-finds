import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Mic,
  Send,
  Info,
} from "lucide-react";
import { useMerchantCart } from "../CartContext";

interface Msg {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Props {
  orderRef: string;
  /** When set, the merchant has confirmed delivery fee and user can pay */
  confirmedFee?: number;
  contactName?: string;
  contactAvatar?: string;
  contactType?: "merchant" | "tailor";
}

export function MerchantChatPage({
  orderRef,
  confirmedFee,
  contactName = "Abete Aso Oke",
  contactAvatar = "https://images.unsplash.com/photo-1605518293497-25b3e0c5dcdf?w=200&q=70",
  contactType = "merchant",
}: Props) {
  const navigate = useNavigate();
  const { items, totalAmount } = useMerchantCart();
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", from: "me", text: "Hi there", time: "09:41 am" },
    {
      id: "2",
      from: "me",
      text: "How much will cover delivery?",
      time: "09:41 am",
    },
    { id: "3", from: "them", text: "Hello", time: "09:41 am" },
    { id: "4", from: "them", text: "One moment pls", time: "09:41 am" },
    {
      id: "5",
      from: "them",
      text: "Dispatch is ₦3,500, should I proceed to set it?",
      time: "09:41 am",
    },
    {
      id: "6",
      from: "me",
      text: "Alright pls do. Thank you.",
      time: "09:41 am",
    },
  ]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [
      ...m,
      { id: String(m.length + 1), from: "me", text: draft, time: "09:41 am" },
    ]);
    setDraft("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] w-full max-w-md flex-col">
      <div className="flex items-center gap-3 pb-3">
        <button onClick={() => navigate({ to: ".." as any })}>
          <ArrowLeft size={18} />
        </button>
        <img
          src={contactAvatar}
          alt={contactName}
          className="h-9 w-9 rounded-full object-cover"
        />
        <h2 className="font-display text-lg font-bold">{contactName}</h2>
      </div>

      {/* Cart strip */}
      <div className="rounded-xl bg-foreground/40 p-2 text-card">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {items.slice(0, 2).map((i) => (
              <img
                key={i.fabricId}
                src={i.image}
                alt={i.name}
                className="h-10 w-10 rounded-md object-cover"
              />
            ))}
          </div>
          <span className="flex-1 text-sm font-semibold">
            {items.length} items
          </span>
          <span className="pr-2 text-sm underline">View selections</span>
        </div>
      </div>

      {/* Conditional fee/payment row */}
      {confirmedFee ? (
        <button
          onClick={() =>
            navigate({
              to: "/dashboard/merchants/order/$orderRef/pay" as any,
              params: { orderRef } as any,
            })
          }
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          Pay ₦{totalAmount.toLocaleString()} + ₦{confirmedFee.toLocaleString()}
          .00 <ArrowRight size={16} />
        </button>
      ) : (
        <div className="mt-2 rounded-xl bg-muted/50 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="font-semibold">₦4,000</span>
          </div>
          <div className="mt-1 flex items-start gap-1.5 text-muted-foreground">
            <Info size={12} className="mt-0.5 shrink-0" />
            <span>
              Once the merchant confirms the delivery fee, you can proceed with
              payment.
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto py-3">
        <div className="text-center text-xs text-muted-foreground">Today</div>
        {msgs.map((m) => {
          const mine = m.from === "me";
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-foreground"
                }`}
              >
                <span>{m.text}</span>
                <span className="ml-2 text-[10px] opacity-70">{m.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border bg-card p-2">
        <button className="p-2 text-muted-foreground">
          <Paperclip size={18} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type Message Here…"
          className="h-10 flex-1 rounded-full bg-muted px-4 text-sm outline-none"
        />
        <button className="p-2 text-muted-foreground">
          <Mic size={18} />
        </button>
        <button
          onClick={send}
          className="rounded-full bg-primary p-2 text-primary-foreground"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
