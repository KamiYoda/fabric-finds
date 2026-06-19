import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  Users,
  CreditCard,
  Truck,
  Store,
  ChevronRight,
  ChevronLeft,
  Star,
  Plus,
  Minus,
  Scissors,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Blobs } from "../components/Blobs";
import { Button } from "../components/Button";
import { PaymentMethodsRow } from "../components/PaymentIcons";

import heroImg from "../assets/heroimg.png";

import showcase1 from "../assets/showcase-1.jpg";
import showcase2 from "../assets/showcase-2.jpg";
import stressRelief from "../assets/stress-relief.jpg";
import story1 from "../assets/story-1.jpg";
import story2 from "../assets/story-2.jpg";
import isewMark from "../assets/isew-mark.png";

import tailor1 from "../assets/tailor1.jpg";
import tailor2 from "../assets/tailor2.jpg";
import tailor3 from "../assets/tailor3.jpg";
import tailor4 from "../assets/tailor4.jpg";
import tailor5 from "../assets/tailor5.jpg";
import tailor6 from "../assets/tailor6.jpg";
import { LabelPill } from "@/components/LabelPill";
import { sub } from "date-fns";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// ─────────────────────────────────────────────────────────────
// Shared Motion Config
// ─────────────────────────────────────────────────────────────

const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    margin: "-80px",
  },
  transition: {
    duration: 0.55,
    ease: EASE_OUT,
  },
};

// ─────────────────────────────────────────────────────────────
// Tailwind-safe background gradients
// ─────────────────────────────────────────────────────────────

const EDGE_FADE_MAP: Record<string, string> = {
  "bg-background": "from-background",
  "bg-cream": "from-cream",
  "bg-card": "from-card",
  "bg-white": "from-white",
};

// ─────────────────────────────────────────────────────────────
// Carousel Types
// ─────────────────────────────────────────────────────────────

interface CarouselItem {
  id: string | number;
}

interface ThreeUpCarouselProps<T extends CarouselItem> {
  items: T[];
  renderCard: (item: T, isCenter: boolean) => React.ReactNode;
  label?: string;
  bgFrom?: keyof typeof EDGE_FADE_MAP;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

// ─────────────────────────────────────────────────────────────
// Memoized Carousel Card Shell
// Prevents unnecessary reconciliation
// ─────────────────────────────────────────────────────────────

interface CarouselCardProps {
  children: React.ReactNode;
  xPct: number;
  scale: number;
  opacity: number;
  zIndex: number;
  reduceMotion: boolean;
  onClick?: () => void;
}

const CarouselCard = memo(function CarouselCard({
  children,
  xPct,
  scale,
  opacity,
  zIndex,
  reduceMotion,
  onClick,
}: CarouselCardProps) {
  return (
    <motion.div
      animate={{
        x: `${xPct}%`,
        scale,
        opacity,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }
      }
      style={{
        zIndex,
        position: "absolute",
        width: "38%",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        perspective: 1000,
        WebkitPerspective: 1000,
        willChange: "transform, opacity",
        contain: "layout paint style",
      }}
      className={onClick ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────
// Production-grade Carousel Engine
// ─────────────────────────────────────────────────────────────

function ThreeUpCarousel<T extends CarouselItem>({
  items,
  renderCard,
  label = "item",
  bgFrom = "bg-background",
  autoPlay = true,
  autoPlayDelay = 5000,
}: ThreeUpCarouselProps<T>) {
  const total = items.length;

  const prefersReducedMotion = useReducedMotion();

  const [active, dispatch] = useReducer(
    (state: number, action: "prev" | "next" | number) => {
      if (action === "prev") {
        return (state - 1 + total) % total;
      }

      if (action === "next") {
        return (state + 1) % total;
      }

      return action;
    },
    0,
  );

  const [paused, setPaused] = useState(false);

  const autoplayRef = useRef<number | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);

  // ───────────────────────────────────────────────────────────
  // Stable callbacks
  // ───────────────────────────────────────────────────────────

  const pauseTemporarily = useCallback(() => {
    setPaused(true);

    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = window.setTimeout(() => {
      setPaused(false);
    }, 6000);
  }, []);

  const prev = useCallback(() => {
    pauseTemporarily();
    dispatch("prev");
  }, [pauseTemporarily]);

  const next = useCallback(() => {
    pauseTemporarily();
    dispatch("next");
  }, [pauseTemporarily]);

  const goTo = useCallback(
    (index: number) => {
      pauseTemporarily();
      dispatch(index);
    },
    [pauseTemporarily],
  );

  // ───────────────────────────────────────────────────────────
  // Autoplay with full cleanup
  // Prevents stale intervals and memory pressure
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!autoPlay || paused || prefersReducedMotion) {
      return;
    }

    autoplayRef.current = window.setInterval(() => {
      dispatch("next");
    }, autoPlayDelay);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
      }
    };
  }, [autoPlay, autoPlayDelay, paused, prefersReducedMotion]);

  // ───────────────────────────────────────────────────────────
  // Cleanup interaction timeout
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }

      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
      }
    };
  }, []);

  // ───────────────────────────────────────────────────────────
  // Memoized calculations
  // ───────────────────────────────────────────────────────────

  const slots = useMemo(() => {
    const leftIdx = (active - 1 + total) % total;
    const rightIdx = (active + 1) % total;

    return [
      {
        idx: leftIdx,
        xPct: -62,
        scale: 0.86,
        opacity: 0.38,
        zIndex: 1,
        onClick: prev,
      },
      {
        idx: active,
        xPct: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
        onClick: undefined,
      },
      {
        idx: rightIdx,
        xPct: 62,
        scale: 0.86,
        opacity: 0.38,
        zIndex: 1,
        onClick: next,
      },
    ];
  }, [active, total, prev, next]);

  const fadeClass = EDGE_FADE_MAP[bgFrom];

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Desktop */}
      <div className="relative hidden md:block">
        {/* Edge fades */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r ${fadeClass} to-transparent`}
        />

        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l ${fadeClass} to-transparent`}
        />

        <div className="overflow-hidden">
          <div
            className="relative flex items-center justify-center"
            style={{
              minHeight: 460,
              contain: "layout paint",
            }}
          >
            {slots.map(({ idx, xPct, scale, opacity, zIndex, onClick }) => (
              <CarouselCard
                key={items[idx].id}
                xPct={xPct}
                scale={scale}
                opacity={opacity}
                zIndex={zIndex}
                onClick={onClick}
                reduceMotion={!!prefersReducedMotion}
              >
                {renderCard(items[idx], xPct === 0)}
              </CarouselCard>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          aria-label={`Previous ${label}`}
          className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-soft backdrop-blur transition-transform duration-200 hover:scale-105 hover:bg-muted active:scale-95"
          style={{
            transform: "translate3d(0,-50%,0)",
            willChange: "transform",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          aria-label={`Next ${label}`}
          className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-soft backdrop-blur transition-transform duration-200 hover:scale-105 hover:bg-muted active:scale-95"
          style={{
            transform: "translate3d(0,-50%,0)",
            willChange: "transform",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Mobile */}
      <div className="relative px-4 md:hidden">
        <div className="overflow-hidden rounded-[28px]">
          <div
            className="flex"
            style={{
              transform: `translate3d(-${active * 100}%,0,0)`,
              transition: prefersReducedMotion
                ? "none"
                : "transform 420ms cubic-bezier(0.22,1,0.36,1)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full shrink-0"
                style={{
                  contain: "layout paint style",
                }}
              >
                {renderCard(item, true)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label={`Previous ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-soft transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={next}
            aria-label={`Next ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-soft transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => goTo(i)}
            aria-label={`Go to ${label} ${i + 1}`}
            aria-current={active === i}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "h-2 w-8 bg-accent"
                : "h-2 w-2 bg-muted hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

const Hero = memo(function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <Blobs />

      <div className="gradient-hero absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          <div>
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles size={14} className="text-accent" />
              Trusted by 0k customers worldwide
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.05,
              }}
              className="mt-6 font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl"
            >
              Custom tailoring,
              <br />
              <span className="text-gradient-accent italic">
                without stories.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.1,
              }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Find trusted tailors, track your outfit, and pay only when you're
              satisfied.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.15,
              }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Get started <ChevronRight size={18} />
                </Button>
              </Link>

              <a href="#how">
                <Button variant="outline" size="lg">
                  How it works
                </Button>
              </a>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.2,
              }}
              className="mt-10 grid max-w-md grid-cols-3 gap-6"
            >
              {[
                { n: "0k", l: "Customers" },
                { n: "0", l: "Tailors" },
                { n: "100%", l: "Satisfaction" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold text-gradient">
                    {s.n}
                  </div>

                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
            style={{
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            <div className="relative overflow-hidden rounded-[2.5rem]">
              <img
                src={heroImg}
                alt="Bespoke tailor at work"
                width={540}
                loading="eager"
                decoding="async"
                className="select-none"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// Showcase Data
// ─────────────────────────────────────────────────────────────

const TAILORS = [
  {
    id: "t1",
    src: tailor1,
    name: "Freddy Han",
    location: "Lagos, Nigeria",
    specialty: "Aso Ebi specialist",
    rating: 4.9,
    reviews: 128,
    verified: true,
  },
  {
    id: "t2",
    src: tailor2,
    name: "Marco Bianchi",
    location: "Ikeja, Nigeria",
    specialty: "Bespoke suits",
    rating: 5.0,
    reviews: 85,
    verified: true,
  },
  {
    id: "t3",
    src: tailor3,
    name: "Amaka Okafor",
    location: "Victoria Island, Nigeria",
    specialty: "Couture & alterations",
    rating: 4.8,
    reviews: 94,
    verified: true,
  },
  {
    id: "t4",
    src: tailor4,
    name: "Chioma Obi",
    location: "Abuja, Nigeria",
    specialty: "Wedding dresses",
    rating: 4.9,
    reviews: 61,
    verified: true,
  },
  {
    id: "t5",
    src: tailor5,
    name: "Emeka Nwosu",
    location: "Ikeja, Nigeria",
    specialty: "Agbada specialist",
    rating: 4.7,
    reviews: 77,
    verified: true,
  },
];

// ─────────────────────────────────────────────────────────────
// Memoized Tailor Card
// ─────────────────────────────────────────────────────────────

const TailorCard = memo(function TailorCard({
  tailor,
  isCenter,
}: {
  tailor: (typeof TAILORS)[0];
  isCenter: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-card transition-shadow ${
        isCenter ? "border-border" : "border-border/40 shadow-soft"
      }`}
      style={{
        contain: "layout paint style",
      }}
    >
      <div className="relative aspect-[8/4] overflow-hidden">
        <img
          src={tailor.src}
          alt={tailor.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />

        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Star size={11} className="fill-accent text-accent" />
          {tailor.rating.toFixed(1)}
        </div>

        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-success/90 px-3 py-1 text-xs font-semibold text-white">
          <ShieldCheck size={11} />
          Verified
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold">
              {tailor.name}
            </h3>

            <p className="text-sm text-muted-foreground">{tailor.location}</p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
            <ShieldCheck size={12} />
            Verified
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{tailor.specialty}</p>

        <p className="mt-4 text-xs text-muted-foreground/70">
          {tailor.reviews} reviews • {tailor.rating.toFixed(1)} rating
        </p>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// Showcase
// ─────────────────────────────────────────────────────────────

const Showcase = memo(function Showcase() {
  const renderCard = useCallback(
    (tailor: (typeof TAILORS)[0], isCenter: boolean) => (
      <TailorCard tailor={tailor} isCenter={isCenter} />
    ),
    [],
  );

  return (
    <section id="showcase" className="relative overflow-hidden py-24 sm:py-32">
      <Blobs />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Master tailors
          </p>

          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Meet our top tailors
          </h2>
        </motion.div>

        <ThreeUpCarousel
          items={TAILORS}
          label="tailor"
          bgFrom="bg-background"
          autoPlay
          autoPlayDelay={4500}
          renderCard={renderCard}
        />
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: "r1",
    quote:
      "Game changer. The fit, the fabric, the follow-through — better than my Saville Row tailor.",
    name: "Daniel Mensah",
    role: "Architect, Accra",
    avatar: tailor1,
  },
  {
    id: "r2",
    quote:
      "I uploaded a Pinterest board and got a perfect Aso Ebi for my wedding. Pure magic.",
    name: "Adaeze N.",
    role: "Bride, Lagos",
    avatar: tailor2,
  },
  {
    id: "r3",
    quote:
      "Finally a platform that respects both customers and craftsmen. Payments are seamless.",
    name: "Tope A.",
    role: "Master tailor",
    avatar: tailor3,
  },
  {
    id: "r4",
    quote:
      "The quality is exceptional. I've never seen tailoring at this level delivered so fast.",
    name: "Kofi Mensah",
    role: "Fashion Enthusiast, Kumasi",
    avatar: tailor4,
  },
  {
    id: "r5",
    quote:
      "Custom pieces that fit perfectly every single time. A game-changer for my wardrobe.",
    name: "Zainab Hassan",
    role: "Corporate Professional, Abuja",
    avatar: tailor5,
  },
  {
    id: "r6",
    quote:
      "Finally, a seamless experience from design to delivery. iSew is the future of tailoring.",
    name: "Chinedu Okafor",
    role: "Entrepreneur, Lagos",
    avatar: tailor6,
  },
];

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  isCenter,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  isCenter: boolean;
}) {
  return (
    <figure
      className={`rounded-3xl border bg-card p-7 transition-shadow ${
        isCenter ? "border-border " : "border-border/40 shadow-soft"
      }`}
      style={{
        contain: "layout paint style",
      }}
    >
      <div className="mb-5 flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
        />

        <div>
          <div className="text-sm font-semibold">{testimonial.name}</div>

          <div className="text-xs text-muted-foreground">
            {testimonial.role}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-1 text-accent">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} size={13} className="fill-current" />
        ))}
      </div>

      <blockquote className="font-display text-base leading-snug">
        "{testimonial.quote}"
      </blockquote>
    </figure>
  );
});

const Testimonials = memo(function Testimonials() {
  const renderCard = useCallback(
    (testimonial: (typeof TESTIMONIALS)[0], isCenter: boolean) => (
      <TestimonialCard testimonial={testimonial} isCenter={isCenter} />
    ),
    [],
  );

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-cream py-24"
    >
      <Blobs variant="rich" />

      <div className="mesh-bg absolute inset-0 -z-10 opacity-70" />

      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Our story
          </p>

          <h2 className="mt-3 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
            Behind every number
            <br />
            is a <span className="text-gradient-accent italic">story.</span>
          </h2>

          <p className="mt-5 text-muted-foreground">
            0 wardrobes. 0 master tailors. Thousands of late-night fittings,
            hand-pulled threads and finished pieces — every order is a
            relationship, every stitch a small act of trust.
          </p>
        </motion.div>

        <ThreeUpCarousel
          items={TESTIMONIALS}
          label="testimonial"
          bgFrom="bg-cream"
          autoPlay
          autoPlayDelay={5200}
          renderCard={renderCard}
        />
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────
// Placeholder sections preserved
// ─────────────────────────────────────────────────────────────
function SayGoodbye() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Blobs />
      <div className="absolute inset-0 -z-10 mesh-bg opacity-60" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              A new era of bespoke
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              Say goodbye to
              <br />
              <span className="relative inline-block">
                <span className="text-gradient-accent italic">
                  tailoring stress.
                </span>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-4 right-0 top-3/5 h-[60px] w-[112%] -translate-y-1/2 overflow-visible"
                  viewBox="0 0 400 60"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 34 C 50 24, 110 42, 170 32 S 290 22, 360 34"
                    stroke="currentColor"
                    className="text-accent"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="6 5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              No more missed deadlines, disappointments or awkward fittings —
              from inspiration to final stitch — into one calm, beautifully
              orchestrated journey.
            </p>
            <div className="mt-8 grid max-w-md gap-4 sm:grid-cols-2">
              {[
                { k: "Zero", v: "missed deadlines" },
                { k: "100%", v: "verified tailors" },
                { k: "Escrow", v: "secured payments" },
                { k: "Fabrics", v: "fabric marketplace at your fingertips" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur"
                >
                  <div className="font-display text-2xl font-bold text-gradient">
                    {s.k}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto h-[520px] w-full max-w-md"
          >
            <div className="absolute left-2 top-6 h-72 w-52 -rotate-6 overflow-hidden rounded-[2rem] shadow-elegant">
              <img
                src={showcase1}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="tape -top-2 left-6 -rotate-6" />
            </div>
            <div className="absolute right-0 top-0 h-80 w-56 rotate-3 overflow-hidden rounded-[2rem] shadow-elegant">
              <img
                src={stressRelief}
                alt="Calm tailoring experience"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="tape -top-2 right-6 rotate-6" />
            </div>
            <div className="absolute bottom-0 left-1/2 h-64 w-56 -translate-x-1/2 rotate-1 overflow-hidden rounded-[2rem] shadow-elegant">
              <img
                src={story2}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="tape -top-2 left-1/2 -translate-x-1/2 -rotate-2" />
            </div>
            <div className="float glass absolute -right-2 bottom-12 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-accent text-primary">
                  <Sparkles size={16} />
                </div>
                <div className="text-xs">
                  <div className="font-semibold">Stress-free</div>
                  <div className="text-muted-foreground">end-to-end</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────

function Features() {
  const items = [
    {
      icon: Users,
      title: "Find trusted tailors",
      subtitle: "Discover tailors",
      color: "orange",
      desc: "Browse verified professionals you can rely on for quality and timely delivery.",
    },
    {
      icon: ShieldCheck,
      title: "Already know a tailor?",
      color: "blue",
      subtitle: "Bring your own tailor",
      desc: "Bring them on iSew and manage everything with payments, progress, and delivery in one place.",
    },
    {
      icon: CreditCard,
      title: "Pay with confidence",
      color: "green",
      subtitle: "Escrow account",
      desc: "Your money is protected until your outfit is delivered... no more stories!",
    },
    {
      icon: Truck,
      title: "Trace every step",
      color: "purple",
      subtitle: "Progress tracking",
      desc: "Stay updated from fabric cutting to final delivery with real-time progress tracking.",
    },
    {
      icon: Store,
      title: "Fabric marketplace",
      color: "yellow",
      subtitle: "Marketplace",
      desc: "Need to get fabric materials? Get from verified i-sew merchants without stress.",
    },
  ] as const;
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <Blobs />
      <div className="absolute inset-0 -z-10 mesh-bg opacity-50" />
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Everything you need
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
            All in{" "}
            <span className="text-gradient-accent italic">one place</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolkit for ordering bespoke without the back-and-forth.
          </p>
        </motion.div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div
              key={it.title}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/10"
            >
              <div className="mb-6 ">
                <LabelPill variant="default" color={it.color}>
                  <p className="text-xs font-semibold">{it.subtitle}</p>
                </LabelPill>
              </div>
              <motion.div
                key={it.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="group relative overflow-hidden"
              >
                <span className="bg-numeral absolute right-4 top-4 select-none">
                  {i + 1}
                </span>
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                    <it.icon size={22} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {it.desc}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// HowItWorks
// ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const flows = {
    customers: [
      {
        n: "01",
        title: "Tell us your vision",
        desc: "Upload inspiration, choose a style and pick your fabric — we guide every choice.",
      },
      {
        n: "02",
        title: "Match with a tailor",
        desc: "Our system pairs you with a verified tailor that matches your style and budget.",
      },
      {
        n: "03",
        title: "Receive & enjoy",
        desc: "Track every stitch and approve the final piece before payment is released.",
      },
    ],
    tailors: [
      {
        n: "01",
        title: "Create your studio",
        desc: "Set up your profile, showcase your craft and list your specialties in minutes.",
      },
      {
        n: "02",
        title: "Receive matched orders",
        desc: "We send you clients that fit your style, location and price range — no chasing.",
      },
      {
        n: "03",
        title: "Get paid securely",
        desc: "Funds are held in escrow and released the moment your work is approved.",
      },
    ],
  } as const;
  const [tab, setTab] = useState<"customers" | "tailors">("customers");
  const steps = flows[tab];

  return (
    <section
      id="how"
      className="relative py-24 bg-primary text-primary-foreground overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, white, transparent 50%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            From idea to wardrobe in three steps
          </h2>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="relative inline-flex rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
            {(["customers", "tailors"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative z-10 rounded-full px-6 py-2 text-sm font-semibold capitalize transition-colors ${
                  tab === key
                    ? "text-primary"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="how-tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                For {key}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all hover:bg-white/10"
            >
              <div className="font-display text-6xl font-bold text-accent/80">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-primary-foreground/70">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Showcase — 3-up carousel
// ─────────────────────────────────────────────────────────────

function FAQ() {
  const items = [
    {
      q: "How are tailors verified?",
      a: "Every tailor goes through portfolio review, ID verification and a craftsmanship test before joining.",
    },
    {
      q: "What if I'm not happy with the result?",
      a: "Funds stay in escrow until you approve. We mediate disputes and offer free re-tailoring within 14 days.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes. Orders ship from your tailor's atelier worldwide via tracked courier.",
    },
    {
      q: "Can I provide my own fabric?",
      a: "Absolutely — or order curated textiles from our marketplace and we'll route them to your tailor.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Questions, answered
          </h2>
        </motion.div>
        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display text-lg font-semibold">
                    {it.q}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {it.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="px-6 pb-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] gradient-primary p-10 text-primary-foreground shadow-elegant sm:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              Style delivered to your inbox.
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Curated drops, tailor spotlights and members-only fabrics. No
              spam, ever.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="h-13 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button variant="accent" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PaymentsBand
// ─────────────────────────────────────────────────────────────

function PaymentsBand() {
  return (
    <section className="relative overflow-hidden py-16">
      <Blobs />
      <div className="mx-auto max-w-5xl px-6 text-center relative">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
        >
          <Scissors
            size={12}
            className="mr-2 inline -translate-y-px text-accent"
          />
          Secure checkout — pay your way
        </motion.p>
        <motion.h3
          {...fadeUp}
          className="mt-3 font-display text-2xl font-semibold sm:text-3xl"
        >
          Every major payment method, beautifully handled.
        </motion.h3>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-8 flex justify-center"
        >
          <PaymentMethodsRow />
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <Navbar />

        <main>
          <Hero />
          <SayGoodbye />
          <Features />
          <HowItWorks />
          <Showcase />
          <Testimonials />
          <PaymentsBand />
          <FAQ />
          <CTA />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
