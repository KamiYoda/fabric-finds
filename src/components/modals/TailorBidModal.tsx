import { Modal } from "./Modal";
import { Button } from "../Button";
import { Star, Clock, Package, CheckCircle2, MapPin } from "lucide-react";

export function TailorBidModal({ open, onClose, tailor, onAccept, onDecline }: any) {
  if (!tailor) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tailor bid"
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onDecline}>Decline</Button>
          <Button variant="primary" className="flex-1" onClick={onAccept}>Accept bid</Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl gradient-primary text-primary-foreground">
          <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold">{tailor?.initials}</div>
          {tailor?.verified && (
            <span className="absolute -bottom-1 -right-1 rounded-full bg-card p-0.5">
              <CheckCircle2 size={16} className="text-success" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold">{tailor?.name}</h3>
          <p className="text-sm text-muted-foreground">{tailor?.shop}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Star size={12} className="fill-accent text-accent" />{tailor?.rating}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} />{tailor?.distance}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat icon={Package} label="Orders" value={tailor?.orders} />
        <Stat icon={CheckCircle2} label="Completion" value={`${tailor?.completion}%`} />
        <Stat icon={Clock} label="Replies in" value={tailor?.replyTime} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Highlight label="Bid price" value={`NGN ${tailor?.bid.toLocaleString()}`} />
        <Highlight label="Delivery" value={tailor?.delivery} />
      </div>

      {tailor?.note && (
        <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground/80">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Note from tailor</span>
          <p className="mt-1">{tailor?.note}</p>
        </div>
      )}
    </Modal>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <Icon size={16} className="mx-auto text-primary" />
      <div className="mt-1 text-sm font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Highlight({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold text-primary">{value}</div>
    </div>
  );
}
