/**
 * UserAvatar
 * Renders a gender-appropriate outfit silhouette inside the avatar circle.
 * Falls back to initials if gender is unknown.
 *
 * Usage:
 *   <UserAvatar user={user} size="md" className="..." />
 */

import { AuthUser } from "@/features/auth/types";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { outer: string; svg: number }> = {
  sm: { outer: "h-7 w-7", svg: 18 },
  md: { outer: "h-8 w-8", svg: 22 },
  lg: { outer: "h-12 w-12", svg: 32 },
};

function MaleIcon({ size }: { size: number }) {
  // Agbada / senator silhouette — broad shoulders, flowing robe
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="12" cy="5.5" r="2.5" fill="currentColor" />
      {/* Fila (cap) */}
      <rect
        x="9.5"
        y="3"
        width="5"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Agbada / wide robe body */}
      <path
        d="M5 10.5C5 9.4 5.9 8.5 7 8.5h10c1.1 0 2 .9 2 2v1.5H5v-1.5z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Flowing sides of agbada */}
      <path
        d="M5 10.5l-1.5 6h4.5l1-5h6l1 5h4.5l-1.5-6H5z"
        fill="currentColor"
        opacity="0.75"
      />
      {/* Trousers */}
      <path
        d="M9 16.5h2.2l.8 4H9l-.5-4zM13 16.5h2.5l-.5 4h-3.2l1.2-4z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function FemaleIcon({ size }: { size: number }) {
  // Iro & buba / ankara dress silhouette
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="12" cy="5" r="2.5" fill="currentColor" />
      {/* Gele / head wrap */}
      <path
        d="M9 4c0 0 .5-2 3-2s3 2 3 2H9z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Buba top */}
      <path
        d="M8.5 8.5C8.5 7.7 9.2 7 10 7h4c.8 0 1.5.7 1.5 1.5v3.5h-7V8.5z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Sleeves */}
      <path d="M6.5 8h2v3h-2z" rx="1" fill="currentColor" opacity="0.7" />
      <path d="M15.5 8h2v3h-2z" rx="1" fill="currentColor" opacity="0.7" />
      {/* Iro skirt — flared */}
      <path d="M8 11.5h8l1.5 9H6.5l1.5-9z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

function InitialsIcon({ initials }: { initials: string }) {
  return <span className="text-sm font-bold leading-none">{initials}</span>;
}

interface UserAvatarProps {
  user: AuthUser | null;
  size?: Size;
  className?: string;
}

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const { outer, svg } = sizeMap[size];

  const initials = user
    ? user.first_name?.[0]?.toUpperCase() ||
      user.name?.[0]?.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "U"
    : "U";

  const gender = user?.gender?.toLowerCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full gradient-primary text-primary-foreground ${outer} ${className}`}
    >
      {gender === "male" ? (
        <MaleIcon size={svg} />
      ) : gender === "female" ? (
        <FemaleIcon size={svg} />
      ) : (
        <InitialsIcon initials={initials} />
      )}
    </div>
  );
}
