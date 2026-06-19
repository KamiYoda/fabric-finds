import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
const Link = RouterLink;
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Shirt,
  Scissors,
  ShieldCheck,
  MapPin,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  Ruler,
} from "lucide-react";
import { Button } from "../../components/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMeasurements } from "@/lib/api/measurements";
import { getOrders } from "@/lib/api/orders";
import { getNotifications } from "@/lib/api/notifications";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Card({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

const quickActions = [
  {
    icon: Shirt,
    title: "Order an outfit",
    desc: "Pick a style, fabric and tailor.",
    tone: "primary",
    to: "/dashboard/create" as const,
    search: undefined,
    bgTone: "text-primary",
  },
  {
    icon: Scissors,
    title: "Add personal tailor",
    desc: "Save your trusted tailors.",
    tone: "accent",
    to: "/dashboard/explore/" as const,
    search: { tab: "my" as const },
    bgTone: "text-accent",
  },
  {
    icon: ShieldCheck,
    title: "Verified tailors",
    desc: "Browse master craftsmen.",
    tone: "success",
    to: "/dashboard/explore/" as const,
    search: { tab: "browse" as const },
    bgTone: "text-success",
  },
  {
    icon: MapPin,
    title: "Fabric Marketplace",
    desc: "Where quality materials awaits you.",
    tone: "primary",
    to: "/dashboard/explore/" as const,
    search: { tab: "browse" as const },
    bgTone: "text-primary",
  },
] as const;

function Overview() {
  const { user, isNewUser } = useAuth();

  const {
    data: measurements,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["measurements"],
    queryFn: () => getMeasurements(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", { per_page: 3 }],
    queryFn: () => getOrders({ per_page: 3 }),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications", { per_page: 5 }],
    queryFn: () => getNotifications({ per_page: 5 }),
    enabled: !!user,
    staleTime: 1000 * 30,
  });

  const displayName = useMemo(() => {
    if (!user) return "there";
    return (
      `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
      user.email ||
      "there"
    );
  }, [user]);

  const measurementsArr = Array.isArray(measurements)
    ? measurements
    : measurements && Array.isArray((measurements as any).data)
      ? (measurements as any).data
      : [];

  const sections = [
    { key: "upper", label: "Upper body" },
    { key: "core", label: "Core fit" },
    { key: "lower", label: "Lower body" },
  ] as const;

  const [selectedSection, setSelectedSection] =
    useState<(typeof sections)[number]["key"]>("upper");
  const selectedMeasurement = measurementsArr[0];

  const measurementEntries = useMemo(() => {
    if (!selectedMeasurement) return [] as [string, string][];

    let entries: [string, any][] = [];
    if (
      selectedMeasurement &&
      (selectedMeasurement as any).values &&
      typeof (selectedMeasurement as any).values === "object"
    ) {
      entries = Object.entries((selectedMeasurement as any).values);
    } else {
      entries = Object.entries(selectedMeasurement).filter(
        ([key]) =>
          ![
            "id",
            "user_id",
            "label",
            "name",
            "unit",
            "created_at",
            "updated_at",
            "values",
          ].includes(key),
      );
    }

    const sectionFields = {
      upper: ["neck", "shoulder", "chest", "burst", "sleeve", "arm_length"],
      core: ["waist_upper", "waist_lower", "hips"],
      lower: ["thigh", "knee", "ankle", "inseam", "trouser_length"],
    };

    const fieldsForSection = sectionFields[selectedSection] || [];

    const matched = entries.filter(([key]) =>
      fieldsForSection.some(
        (field) =>
          key.toLowerCase() === field.toLowerCase() ||
          key.toLowerCase().includes(field.toLowerCase()) ||
          field.toLowerCase().includes(key.toLowerCase()),
      ),
    );

    if (matched.length === 0) {
      return fieldsForSection.slice(0, 4).map((field) => [field, "—"]);
    }

    return matched;
  }, [selectedMeasurement, selectedSection]);

  const ordersArr = Array.isArray(orders)
    ? orders
    : orders && Array.isArray((orders as any).data)
      ? (orders as any).data
      : [];

  const notificationsArr = Array.isArray(notifications)
    ? notifications
    : notifications && Array.isArray((notifications as any).data)
      ? (notifications as any).data
      : [];

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      {/* Greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-5 sm:p-8 text-primary-foreground shadow-elegant"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-xs sm:text-sm text-primary-foreground/70">
              {isNewUser ? "Welcome" : "Welcome back"}
            </p>
            <h1 className="font-display text-2xl font-bold sm:text-4xl">
              Hi, {displayName} 👋
            </h1>
            <p className="mt-1.5 sm:mt-2 max-w-md text-sm sm:text-base text-primary-foreground/80">
              Order custom outfits from verified tailors and track every stitch.
            </p>
          </div>
          {/* <div className="flex gap-2 sm:gap-3">
            <Link to="/dashboard/create">
              <Button variant="accent" size="sm" className="sm:size-lg">
                New order <Plus size={14} />
              </Button>
            </Link>
            <Link to="/dashboard/explore/" search={{ tab: "browse" }}>
              <Button variant="glass" size="sm" className="sm:size-lg">
                Find a tailor
              </Button>
            </Link>
          </div> */}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {quickActions.map((q, i) => (
          <Link
            key={q.title}
            to={q.to}
            {...(q.search ? { search: q.search } : {})}
          >
            <Card
              delay={i * 0.05}
              className="h-full cursor-pointer hover:-translate-y-1 transition-all hover:shadow-elegant"
            >
              <div
                className={`mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ${
                  q.tone === "accent"
                    ? "gradient-accent text-primary"
                    : q.tone === "success"
                      ? "bg-success text-white"
                      : "gradient-primary text-primary-foreground"
                }`}
              >
                <q.icon size={18} />
              </div>
              <h3 className="font-display text-sm sm:text-base font-semibold leading-tight">
                {q.title}
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                {q.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Measurements */}
        <Card delay={0.1} className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-semibold">
              My measurements
              {isFetching && !isLoading && (
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-muted-foreground">
                  <Loader2
                    size={12}
                    className="inline-block animate-spin mr-1"
                  />
                  Refreshing…
                </span>
              )}
            </h2>
            <Link
              to="/dashboard/measurements"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              Manage
            </Link>
          </div>

          <div className="mt-3 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setSelectedSection(section.key)}
                className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium transition-colors ${
                  selectedSection === section.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="mt-3 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-6 sm:py-8 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                <span className="ml-2">Loading measurements…</span>
              </div>
            ) : (
              <>
                {measurementEntries.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-background p-3 sm:p-4"
                  >
                    <div className="text-[11px] sm:text-xs text-muted-foreground capitalize">
                      {label}
                    </div>
                    <div className="mt-1 font-display text-xl sm:text-2xl font-bold">
                      {String(value) || "—"}
                    </div>
                  </div>
                ))}
                {measurementEntries.length === 0 && (
                  <div className="col-span-full text-center py-6 sm:py-8 text-sm text-muted-foreground">
                    No measurements recorded yet
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card delay={0.15}>
          <h2 className="font-display text-lg sm:text-xl font-semibold">
            Notifications
          </h2>
          {notificationsArr.length === 0 ? (
            <div className="mt-4 sm:mt-5 rounded-3xl border border-border bg-muted p-6 sm:p-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {notificationsArr.slice(0, 5).map((n: any, i: number) => (
                <li
                  key={n.id ?? i}
                  className="flex gap-2.5 sm:gap-3 rounded-xl p-2 hover:bg-muted"
                >
                  <div
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.type === "success"
                        ? "bg-success"
                        : n.type === "promotion"
                          ? "bg-accent"
                          : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm">
                      {n.title ?? n.message ?? n.t}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      {n.time_ago ?? n.created_at ?? ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <Card delay={0.2}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg sm:text-xl font-semibold">
            Recent orders
          </h2>
          <Link
            to="/dashboard/orders"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 sm:mt-5 divide-y divide-border">
          {ordersArr.length === 0 ? (
            <div className="rounded-3xl border border-border bg-muted p-6 sm:p-8 text-center text-sm text-muted-foreground">
              No recent orders yet.
            </div>
          ) : (
            ordersArr.slice(0, 3).map((o: any, i: number) => (
              <div
                key={o.id ?? i}
                className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl gradient-cream text-primary">
                  <Shirt size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-semibold truncate">
                    {o.title ?? o.name ?? `${o.outfit_category ?? ""}`}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock size={11} />{" "}
                    {o.estimated_timeline_days
                      ? `ETA ${o.estimated_timeline_days} days`
                      : ""}{" "}
                    · {o.tailor_name ?? o.tailor?.name ?? ""}
                  </div>
                </div>
                <div className="hidden sm:block flex-1 min-w-[120px]">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{
                        width: `${o.progress ?? o.completion_percentage ?? 0}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs font-semibold text-success">
                    {o.progress ?? o.completion_percentage ?? 0}%
                  </div>
                </div>
                <button className="rounded-full bg-muted p-1.5 sm:p-2 hover:bg-secondary shrink-0">
                  <ChevronRight size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
