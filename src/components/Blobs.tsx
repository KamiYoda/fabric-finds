const fabric = new URL("../assets/fabric.png", import.meta.url).href;
const tape = new URL("../assets/tape.png", import.meta.url).href;
const blob = new URL("../assets/blob.png", import.meta.url).href;

const AMOEBA_PATH =
  "M120.5,170.0L113.5,167.0L108.5,162.0L104.0,156.5L99.0,151.5L92.5,148.0L85.0,145.5L76.5,144.0L67.0,143.5L58.5,145.0L50.0,146.5L43.0,149.5L35.0,151.5L25.0,151.5L17.5,149.0L11.5,145.0L7.0,139.5L3.5,133.0L1.0,125.5C0,90 15,60 45,35C70,10 95,0 120,5C145,10 165,30 170,55C180,60 183,75 183,90C183,110 170,125 150,130C148,145 140,160 120.5,170Z";

function Amoeba({
  className,
  color,
  width,
  height,
}: {
  className?: string;
  color: string;
  width: string;
  height: string;
}) {
  return (
    <svg
      className={className}
      style={{ width, height }}
      viewBox="0 0 183 171"
      fill="none"
    >
      <path d={AMOEBA_PATH} fill={color} />
    </svg>
  );
}

export function Blobs({
  variant = "default",
}: {
  variant?: "default" | "rich";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Top left */}
      <Amoeba
        className="absolute -top-20 -left-24 opacity-[0.08] rotate-12"
        width="clamp(220px, 32vw, 500px)"
        height="clamp(200px, 28vw, 460px)"
        color="oklch(0.88 0.08 60)"
      />

      {/* Right */}
      <Amoeba
        className="absolute top-1/4 -right-24 opacity-[0.08] -rotate-12 scale-x-[-1]"
        width="clamp(220px, 30vw, 480px)"
        height="clamp(200px, 26vw, 420px)"
        color="oklch(0.75 0.10 260)"
      />

      {/* Bottom */}
      <Amoeba
        className="absolute -bottom-24 left-1/3 opacity-[0.08] rotate-45 scale-y-[-1]"
        width="clamp(260px, 36vw, 560px)"
        height="clamp(220px, 32vw, 500px)"
        color="oklch(0.82 0.10 45)"
      />

      {variant === "rich" && (
        <>
          <img
            src={fabric}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute -right-10 top-1/4 h-56 w-auto opacity-[0.06] mix-blend-multiply sm:h-80"
          />

          <img
            src={tape}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute -left-12 bottom-20 h-48 w-auto opacity-[0.05] sm:h-72"
          />
        </>
      )}
    </div>
  );
}