import { memo } from "react";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: { stars: number; review: string };
}

export const RatingDisplay = memo(({ rating }: RatingDisplayProps) => {
  return (
    <div className="mt-3 rounded-2xl bg-success/10 p-4">
      <div className="text-sm font-semibold text-success">Your rating</div>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={16}
            className={
              n <= rating.stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-yellow-400"
            }
          />
        ))}
      </div>
      {rating.review && (
        <p className="mt-2 text-sm text-muted-foreground">
          &quot;{rating.review}&quot;
        </p>
      )}
    </div>
  );
});

RatingDisplay.displayName = "RatingDisplay";
