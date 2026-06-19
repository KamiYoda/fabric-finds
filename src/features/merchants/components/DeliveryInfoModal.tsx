import { useState } from "react";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/Button";
import { MapPin } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onContinue: (mode: "tailor" | "self") => void;
}

export function DeliveryInfoModal({ open, onClose, onContinue }: Props) {
  const [mode, setMode] = useState<"tailor" | "self">("tailor");

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center gap-2">
        <MapPin size={20} />
        <h2 className="font-display text-xl font-bold">Delivery information</h2>
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={() => setMode("tailor")}
          className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
            mode === "tailor"
              ? "border-primary bg-primary/5"
              : "border-transparent bg-muted"
          }`}
        >
          <div className="font-semibold">Send to tailor</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Choose a tailor from your pending orders
          </div>
        </button>
        <button
          onClick={() => setMode("self")}
          className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
            mode === "self"
              ? "border-primary bg-primary/5"
              : "border-transparent bg-muted"
          }`}
        >
          <div className="font-semibold">Shop for self</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Enter your delivery address
          </div>
        </button>
      </div>

      <Button
        variant="primary"
        onClick={() => onContinue(mode)}
        className="mt-8 w-full"
      >
        Continue
      </Button>
    </Modal>
  );
}
