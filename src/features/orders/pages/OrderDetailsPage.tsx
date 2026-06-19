import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Mic,
  Send,
  Info,
  ChevronRight,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrder,
  sendFabric,
  acknowledgeFabric,
  acknowledgeCompletion,
} from "@/lib/api/orders";
import { OrderSummary } from "../components/OrderSummary";
import { RatingDisplay } from "../components/RatingDisplay";
import { ChatMessage } from "../components/ChatMessage";
import {
  type ApiOrder,
  type UIStage,
  statusToStage,
  tailorDisplayName,
  tailorAvatar,
  formatAmount,
} from "../types";
import { getRated } from "@/lib/orderStage";

interface OrderDetailsPageProps {
  orderId: string;
}

function bannerSubtitle(stage: UIStage): string {
  switch (stage) {
    case "review":
      return "Pending tailor confirmation";
    case "confirmed":
      return "Ready for payment";
    case "awaiting_fabric":
      return "Awaiting fabrics";
    case "fabric_sent":
      return "Fabrics dispatched";
    case "work_started":
      return "Work in progress";
    case "cutting_done":
      return "Cutting completed";
    case "ready_for_ack":
      return "Ready for delivery";
    case "closed":
      return "Completed";
  }
}

export const OrderDetailsPage = memo(({ orderId }: OrderDetailsPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [showStartedBanner, setShowStartedBanner] = useState(true);
  const [draft, setDraft] = useState("");
  // Local messages list — API chat is null for now; extend when chat endpoint is live
  const [messages, setMessages] = useState<any[]>([]);

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await getOrder(orderId);
      const order: ApiOrder = res?.data ?? res;
      return order;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60, // poll every minute for status changes
  });

  // Seed milestone messages from API milestones
  useEffect(() => {
    if (!orderData) return;
    const milestoneMessages = (orderData.milestones ?? []).map((m) => ({
      id: m.id,
      from: "tailor" as const,
      time: new Date(m.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      milestone: {
        label: `${m.title} — ${m.percentage}%`,
        images: m.photos ?? [],
      },
    }));
    setMessages(milestoneMessages);
  }, [orderData]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const order = orderData;
  const stage: UIStage = order ? statusToStage(order.status) : "review";
  const isClosed = stage === "closed";
  const rated = getRated(orderId);

  const tailorName = tailorDisplayName(order?.tailor ?? null);
  const avatar = tailorAvatar(order?.tailor ?? null);
  const totalDisplay = formatAmount(
    order?.total_amount ?? order?.proposed_amount,
  );

  const handleSend = useCallback(() => {
    if (!draft.trim() || isClosed) return;
    setMessages((m) => [
      ...m,
      { id: String(Date.now()), from: "me", text: draft, time: "now" },
    ]);
    setDraft("");
    // TODO: POST to chat endpoint when available
  }, [draft, isClosed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const invalidateOrder = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient, orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl items-center justify-center">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <p>Failed to load order.</p>
        <Link to="/dashboard/orders" className="text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          to="/dashboard/orders"
          className="rounded-full p-1.5 hover:bg-muted"
        >
          <ArrowLeft size={18} />
        </Link>
        {avatar ? (
          <img
            src={avatar}
            alt={tailorName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-xs font-bold text-primary-foreground">
            {tailorName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-semibold truncate">
            {tailorName}
          </div>
          {order.tailor?.shop_name && (
            <div className="text-xs text-muted-foreground">
              {order.tailor.shop_name}
            </div>
          )}
        </div>
      </div>

      {/* Order banner */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setSummaryOpen(true)}
          className={`flex w-full items-stretch gap-2 rounded-2xl p-1 text-left transition-colors ${
            stage === "review" ? "bg-muted" : "bg-accent/40"
          }`}
        >
          <div className="flex gap-1.5 p-1">
            {order.style_reference_photos.slice(0, 2).map((url, i) => (
              <div
                key={i}
                className="h-14 w-12 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url('${url}')` }}
              />
            ))}
            {order.style_reference_photos.length === 0 && (
              <>
                <div className="h-14 w-12 shrink-0 rounded-lg bg-gradient-to-br from-accent/30 to-primary/20" />
                <div className="h-14 w-12 shrink-0 rounded-lg bg-gradient-to-br from-muted to-secondary" />
              </>
            )}
          </div>
          <div
            className={`flex flex-1 items-center justify-between rounded-xl px-4 py-2 ${
              stage === "review"
                ? "bg-foreground/60 text-primary-foreground"
                : "bg-accent text-primary"
            }`}
          >
            <div className="min-w-0">
              <div className="font-semibold truncate">{order.title}</div>
              <div className="inline-flex items-center gap-1 text-xs opacity-90">
                {bannerSubtitle(stage)}
                {isClosed && <CheckCircle2 size={12} />}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium shrink-0">
              View order <ChevronRight size={14} />
            </div>
          </div>
        </button>

        {/* Stage CTAs */}
        {stage === "review" && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-muted/70 px-4 py-3 text-xs">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>
                {order.status === "draft"
                  ? "Your order is saved as a draft. Send it to a tailor to begin."
                  : "Once your order is confirmed by the tailor, you can proceed with payment."}
              </span>
            </div>
          </div>
        )}

        {stage === "confirmed" && (
          <button
            onClick={() =>
              navigate({
                to: "/dashboard/orders/$orderId/pay",
                params: { orderId },
              })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Pay {totalDisplay} <ArrowRight size={16} />
          </button>
        )}

        {stage === "awaiting_fabric" && (
          <button
            onClick={() =>
              navigate({
                to: "/dashboard/orders/$orderId/fabric",
                params: { orderId },
              })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Confirm you've sent fabrics
          </button>
        )}

        {stage === "fabric_sent" && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-primary/40 px-4 py-3.5 text-sm font-semibold text-primary-foreground">
            Awaiting tailor to acknowledge fabrics
          </div>
        )}

        {stage === "work_started" && showStartedBanner && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <span className="flex-1 text-center">
              Fabrics received. Work started.
            </span>
            <button
              onClick={() => setShowStartedBanner(false)}
              className="rounded-full p-0.5 hover:bg-primary-foreground/20"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {stage === "cutting_done" && (
          <div className="mt-3 flex items-center justify-center rounded-2xl bg-success/20 px-4 py-3.5 text-sm font-semibold text-success">
            Cutting completed · in progress
          </div>
        )}

        {stage === "ready_for_ack" && (
          <button
            onClick={() =>
              navigate({
                to: "/dashboard/orders/$orderId/acknowledge",
                params: { orderId },
              })
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Acknowledge dress <ArrowRight size={16} />
          </button>
        )}

        {isClosed && (
          <div className="mt-3 rounded-2xl bg-[#E8761F] px-4 py-3.5 text-center text-sm font-semibold text-primary-foreground">
            Order closed
          </div>
        )}

        {isClosed && rated && <RatingDisplay rating={rated} />}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>

      {/* Input */}
      {!isClosed && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <button className="text-muted-foreground hover:text-foreground">
              <Paperclip size={18} />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Mic size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <OrderSummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        orderId={orderId}
      />
    </div>
  );
});

OrderDetailsPage.displayName = "OrderDetailsPage";
