import { memo } from "react";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/Button";
import type { Tailor } from "@/features/tailors/types";

interface Props {
  tailor: Tailor;
  onViewProfile?: (t: Tailor) => void;
  onBook?: (t: Tailor) => void;
}

export const TailorListCard = memo(
  ({ tailor, onViewProfile, onBook }: Props) => {
    const distance =
      tailor.responseTime && /km/i.test(tailor.responseTime)
        ? tailor.responseTime
        : null;
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
        <div className="flex items-start gap-3">
          <img
            src={
              tailor.avatar ||
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=70"
            }
            alt={tailor.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="truncate font-display text-sm font-semibold">
                {tailor.name}
              </h3>
              {tailor.verified && (
                <BadgeCheck
                  size={13}
                  className="shrink-0 fill-primary text-primary-foreground"
                />
              )}
              {distance && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MapPin size={11} /> {distance}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span className="tabular-nums">{tailor.rating?.toFixed(1)}</span>
            </div>
            {tailor.specialties.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {tailor.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => onViewProfile?.(tailor)}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
          >
            View Profile
          </button>
          <Button
            onClick={() => onBook?.(tailor)}
            size="sm"
            className="!px-4 !py-2 text-xs"
          >
            Book service
          </Button>
        </div>
      </div>
    );
  },
);

TailorListCard.displayName = "TailorListCard";
