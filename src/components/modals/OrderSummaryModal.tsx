import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { CheckCircle2, ArrowRight, Edit3 } from "lucide-react";

export function OrderSummaryModal({ open, onClose, order, onEdit, onSend, isSubmitting }: any) {
  const [budget, setBudget] = useState("");
  const [orderName, setOrderName] = useState("");
  const [fabric, setFabric] = useState("");

  if (!order) return null;

  const canSend = budget && orderName && fabric && !isSubmitting;

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* Tailor header */}
      <div className="flex items-start gap-3">
        <img
          src={order.tailor?.avatar ?? "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=70"}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-bold">{order.tailor?.name ?? "Selected tailor"}</div>
          <div className="text-sm text-primary">{order.tailor?.shop ?? "Verified by i-sew"}</div>
        </div>
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          verified <CheckCircle2 size={14} className="text-primary" />
        </div>
      </div>

      {/* Style summary */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-accent/40 to-primary/30" />
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-muted to-secondary" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold">Styles</div>
          <p className="truncate text-xs text-muted-foreground">{order.styles}</p>
        </div>
        <button onClick={onEdit} className="rounded-full p-2 text-muted-foreground hover:bg-card">
          <Edit3 size={14} />
        </button>
      </div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl border-2 border-accent bg-card py-3 text-center"
      >
        <span className="text-sm text-muted-foreground">from </span>
        <span className="font-display text-lg font-bold text-primary">
          NGN {order.price.toLocaleString()}.00
        </span>
      </motion.div>

      {/* Budget */}
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium">What's your budget?</label>
        <div className="flex h-12 items-center rounded-xl border-2 border-primary/40 bg-card px-4 focus-within:ring-2 focus-within:ring-ring/30">
          <span className="text-sm font-semibold text-primary">NGN</span>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^\d,]/g, ""))}
            placeholder=""
            className="ml-2 w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Order name */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">Create a name for this order</label>
        <input
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
          className="h-12 w-full rounded-xl border-2 border-primary/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Fabric provision */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">Fabric provision</label>
        <select
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
          className={`h-12 w-full rounded-xl border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 ${fabric ? "border-border" : "border-border text-muted-foreground"
            }`}
        >
          <option value="">Select an option</option>
          <option value="self">I'll provide fabric</option>
          <option value="tailor">Tailor provides fabric</option>
        </select>
      </div>

      {/* Send button */}
      <Button
        onClick={() => canSend && onSend?.({ budget, orderName, fabric })}
        disabled={!canSend}
        variant="primary"
        className={'mt-6 w-full' + (canSend ? '' : ' cursor-not-allowed opacity-50')}
      >
        {isSubmitting ? "Sending..." : "Send order"} <ArrowRight size={16} />
      </Button>
    </Modal>
  );
}
