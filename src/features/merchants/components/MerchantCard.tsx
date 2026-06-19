import { memo, useCallback } from "react";
import { BadgeCheck, Star, MapPin, Heart } from "lucide-react";
import type { Merchant } from "../types";

interface Props {
  merchant: Merchant;
  onClick: (m: Merchant) => void;
  onSave?: (m: Merchant) => void;
}

export const MerchantCard = memo(({ merchant, onClick, onSave }: Props) => {
  const handleClick = useCallback(() => onClick(merchant), [onClick, merchant]);
  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSave?.(merchant);
    },
    [merchant, onSave],
  );

  return (
    <button
      onClick={handleClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-card text-left transition-transform hover:scale-[1.02]"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={merchant.avatar}
          alt={merchant.name}
          className="h-full w-full object-cover"
        />
      </div>
      <button
        onClick={handleSave}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-primary hover:text-white"
      >
        <Heart
          size={14}
          className={merchant.isSaved ? "fill-primary text-primary" : ""}
        />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-base font-bold">{merchant.name}</h3>
              {merchant.verified && (
                <BadgeCheck
                  size={14}
                  className="shrink-0 fill-primary text-secondary"
                />
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-primary">
              {merchant.shop}
            </p>
            {merchant.distanceKm !== undefined && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={10} /> {merchant.distanceKm}km away
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="rounded-full bg-muted px-2.5 py-1">
                {merchant.ordersCount} orders
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1">
                {merchant.completionRate}% complete
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-0.5 text-sm font-bold">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span>{merchant.rating}</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {merchant.reviewCount} reviews
            </div>
          </div>
        </div>
        {merchant.specialties.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {merchant.specialties.slice(0, 2).map((s) => (
              <span
                key={s}
                className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
});

MerchantCard.displayName = "MerchantCard";
