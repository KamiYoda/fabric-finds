import { forwardRef } from "react";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 stitch stitch-light",
  accent:
    "gradient-accent text-primary hover:shadow-accent hover:-translate-y-0.5 stitch stitch-dark",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted stitch stitch-dark",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-muted stitch stitch-dark",
  glass:
    "glass text-foreground hover:bg-white/90 stitch stitch-dark",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base py-3.5",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, any>(function Button(
  { variant = "primary", size = "md", className = "", children, ...props }: any,
  ref
) {
  return (
    <button
      ref={ref}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${(variants as any)[variant]} ${(sizes as any)[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
});
