import { memo, useCallback, useState } from "react";
import { Star, MapPin, BadgeCheck, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { Tailor } from "@/features/tailors/types";
import { saveTailor } from "@/lib/api/tailors";

interface TailorCardProps {
  tailor: Tailor;
  onClick: (tailor: Tailor) => void;
  showDistance?: boolean;
  onSave?: (tailor: Tailor) => void;
}

export const TailorCard = memo(
  ({ tailor, onClick, showDistance = false, onSave }: TailorCardProps) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleClick = useCallback(() => {
      onClick(tailor);
    }, [onClick, tailor]);

    const handleSave = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);
        try {
          await saveTailor(tailor.id);
          onSave?.(tailor);
        } catch (error) {
          console.error("Failed to save tailor:", error);
        } finally {
          setIsSaving(false);
        }
      },
      [tailor, onSave],
    );

    return (
      <button
        onClick={handleClick}
        className="group relative w-full overflow-hidden rounded-2xl bg-card text-left transition-transform hover:scale-[1.02]"
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={
              tailor.user?.profile_photo ||
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=70"
            }
            alt={tailor.business_name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Save button overlay */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
        >
          <Heart
            size={14}
            className={`transition-all ${isSaving ? "animate-pulse" : ""} ${
              tailor.isSaved ? "fill-primary text-primary" : ""
            }`}
          />
        </button>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-base font-bold">{tailor.name}</h3>
                {tailor.verified && (
                  <BadgeCheck
                    size={14}
                    className="shrink-0 fill-primary text-secondary"
                  />
                )}
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={10} />
                <span className="font-medium">{tailor.location}</span>
              </div>

              {/* Additional details row */}
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground font-medium">
                {tailor.completedOrders && (
                  <span className="rounded-full bg-muted px-2.5 py-1">
                    {tailor.completedOrders} orders
                  </span>
                )}
                {tailor.acceptance_rate && (
                  <span className="rounded-full bg-muted px-2.5 py-1">
                    {tailor.acceptance_rate}% accept
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-0.5 text-sm font-bold">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{tailor.rating}</span>
              </div>
              {tailor.reviewCount > 0 && (
                <div className="text-xs text-muted-foreground font-medium">
                  {tailor.reviewCount} reviews
                </div>
              )}
            </div>
          </div>

          {/* Specialties badges */}
          {tailor.specialties.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tailor.specialties.slice(0, 2).map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>
    );
  },
);

TailorCard.displayName = "TailorCard";
