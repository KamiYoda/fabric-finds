import { memo } from "react";
import { Star, BadgeCheck } from "lucide-react";
import type { FabricMerchant } from "../utils/mockFabricMerchants";

interface Props {
  merchant: FabricMerchant;
  onClick?: (m: FabricMerchant) => void;
}

export const FabricMerchantCard = memo(({ merchant, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(merchant)}
      className="group w-full overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-elegant"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={merchant.image}
          alt={merchant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1">
          <h3 className="truncate text-sm font-semibold">{merchant.name}</h3>
          {merchant.verified && (
            <BadgeCheck
              size={13}
              className="shrink-0 fill-primary text-primary-foreground"
            />
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span className="tabular-nums">{merchant.rating.toFixed(2)}</span>
        </div>
      </div>
    </button>
  );
});

FabricMerchantCard.displayName = "FabricMerchantCard";

export const FabricMerchantListCard = memo(
  ({
    merchant,
    onRemove,
    onOrder,
  }: {
    merchant: FabricMerchant;
    onRemove?: (id: string) => void;
    onOrder?: (m: FabricMerchant) => void;
  }) => {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <img
            src={merchant.image}
            alt={merchant.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate font-display text-sm font-semibold">
                {merchant.name}
              </h3>
              {merchant.verified && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
                  verified{" "}
                  <BadgeCheck
                    size={13}
                    className="fill-primary text-primary-foreground"
                  />
                </span>
              )}
            </div>
            {merchant.bio && (
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {merchant.bio}
              </p>
            )}
            {merchant.tags && merchant.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {merchant.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          {onRemove && (
            <button
              onClick={() => onRemove(merchant.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
            >
              − Remove
            </button>
          )}
          <button
            onClick={() => onOrder?.(merchant)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Order
          </button>
        </div>
      </div>
    );
  },
);

FabricMerchantListCard.displayName = "FabricMerchantListCard";
