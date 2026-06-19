import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

interface Props {
  orderRef: string;
}

export function MerchantOrderSuccessPage({ orderRef }: Props) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center pt-12 text-center">
      <div className="rounded-full bg-primary/10 p-3 text-primary">
        <CheckCircle2 size={22} />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">Successful!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Payment has been made for order{" "}
        <span className="font-semibold text-primary underline">{orderRef}</span>
        .
        <br />
        Tailor has been notified and work will start immediately.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate({ to: "/dashboard/orders" as any })}
        className="mt-8 w-full"
      >
        View order
      </Button>
      <button
        onClick={() => navigate({ to: "/dashboard" as any })}
        className="mt-3 text-sm font-medium text-muted-foreground"
      >
        Go to dashboard
      </button>
    </div>
  );
}
