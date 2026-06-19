import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit3, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./Button";
import { Input } from "./Input";
import { MeasurementEditorModal } from "./MeasurementEditorModal";
import {
  createMeasurement,
  getMeasurements,
  updateMeasurement,
} from "@/lib/api/measurements";
import upperIllustration from "../assets/ill.png";
import lowerIllustration from "../assets/ill-1.png";
import coreIllustration from "../assets/ill-2.png";
import {
  defaultMeasurementValues,
  emptyMeasurement,
  measurementGuideSteps,
  measurementSections,
  type Measurement,
} from "./measurement-data";

export type { Measurement } from "./measurement-data";

// ─── Payload helpers ──────────────────────────────────────────────────────────

function parseMeasurementNumber(
  v: string | number | null | undefined,
): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(
    String(v)
      .trim()
      .replace(/[^0-9.\-]/g, ""),
  );
  return Number.isFinite(n) && !isNaN(n) ? n : null;
}

function normalizeMeasurementItem(item: any): Measurement {
  const name = item.label ?? item.name ?? "Untitled";
  const unit: "IN" | "CM" =
    String(item.unit ?? "").toLowerCase() === "cm" ? "CM" : "IN";

  const v = (key: string) => {
    const val = item[key] ?? item.values?.[key];
    return val !== null && val !== undefined ? String(val) : "";
  };

  return {
    id: String(item.id ?? `${name}-${Date.now()}`),
    name,
    unit,
    values: {
      Neck: v("neck"),
      Shoulder: v("shoulder"),
      Chest: v("chest"),
      "Chest/Bust": v("burst"),
      Bicep: v("bicep"),
      "Arm length": v("arm_length"),
      Sleeve: v("sleeve"),
      Wrist: v("wrist"),
      "Waist upper": v("waist_upper"),
      "Waist lower": v("waist_lower"),
      Hip: v("hips"),
      Thigh: v("thigh"),
      Knee: v("knee"),
      Calf: v("calf"),
      Ankle: v("ankle"),
      Inseam: v("inseam"),
      "Trouser length": v("trouser_length"),
      "Head circumference": "",
      Hand: "",
      "Back length": "",
    },
  };
}

function measurementToApiPayload(m: Measurement) {
  const v = m.values;
  const unit: "inches" | "cm" =
    m.unit === "CM" || m.unit === "cm" ? "cm" : "inches";

  return {
    label: m.name,
    unit,
    neck: parseMeasurementNumber(v["Neck"]),
    chest: parseMeasurementNumber(v["Chest"]),
    burst: parseMeasurementNumber(v["Chest/Bust"]),
    shoulder: parseMeasurementNumber(v["Shoulder"]),
    bicep: parseMeasurementNumber(v["Bicep"]),
    arm_length: parseMeasurementNumber(v["Arm length"]),
    sleeve: parseMeasurementNumber(v["Sleeve"]),
    wrist: parseMeasurementNumber(v["Wrist"]),
    waist_upper: parseMeasurementNumber(v["Waist upper"]),
    waist_lower: parseMeasurementNumber(v["Waist lower"]),
    hips: parseMeasurementNumber(v["Hip"]),
    thigh: parseMeasurementNumber(v["Thigh"]),
    knee: parseMeasurementNumber(v["Knee"]),
    calf: parseMeasurementNumber(v["Calf"]),
    ankle: parseMeasurementNumber(v["Ankle"]),
    inseam: parseMeasurementNumber(v["Inseam"]),
    trouser_length: parseMeasurementNumber(v["Trouser length"]),
  };
}

// ─── MeasurementGuide ─────────────────────────────────────────────────────────

export function MeasurementGuide() {
  const guideItems = [
    {
      src: upperIllustration,
      title: "Upper body",
      description: "Neck, shoulder, chest and arm measurements?.",
    },
    {
      src: coreIllustration,
      title: "Core fit",
      description: "Waist and hip measurements for the torso.",
    },
    {
      src: lowerIllustration,
      title: "Lower body",
      description: "Thigh, calf and inseam measurements?.",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Illustrative guide
          </p>
          <h2 className="mt-2 text-xl font-semibold">Measurement aid</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow the numbered body guide for accurate measurements before
            saving.
          </p>
        </div>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Watch tutorial video
        </a>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {guideItems.map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-3xl border border-border bg-muted"
          >
            <img
              src={item.src}
              alt={`${item.title} measurement guide`}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <div className="text-sm font-semibold">{item.title}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {measurementGuideSteps.map((step) => (
          <div
            key={step.title}
            className="rounded-3xl border border-border bg-card p-4"
          >
            <div className="text-sm font-semibold">{step.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MeasurementManager ───────────────────────────────────────────────────────

export function MeasurementManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Measurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<Measurement>(emptyMeasurement);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: measurements = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery<Measurement[]>({
    queryKey: ["measurements"],
    queryFn: async () => {
      const result = await getMeasurements();
      if (!Array.isArray(result)) return [];
        return result as Measurement[];
    },
    // Cache measurements for a while — they don't change frequently.
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (!selectedId && measurements?.length > 0) {
      setSelectedId(measurements[0].id);
    }
  }, [measurements, selectedId]);

  const selectedMeasurement =
    measurements?.find((m) => m.id === selectedId) ||
    measurements[0] ||
    emptyMeasurement;

  const openEditor = (measurement?: Measurement) => {
    if (measurement) {
      setDraft({ ...measurement });
      setEditing(measurement);
    } else {
      setDraft({ ...emptyMeasurement, id: `new-${Date.now()}` });
      setEditing(null);
    }
    setIsModalOpen(true);
  };

  const saveMeasurement = async () => {
    const next = { ...draft, id: draft.id || `measurement-${Date.now()}` };
    try {
      if (editing && measurements?.some((item) => item.id === next.id)) {
        await updateMeasurement(next.id, measurementToApiPayload(next));
      } else {
        await createMeasurement(measurementToApiPayload(next));
      }
      await queryClient.invalidateQueries({ queryKey: ["measurements"] });
      setSelectedId(next.id);
      setEditing(null);
      setIsModalOpen(false);
      toast.success(`Measurement saved as "${next.name}".`);
    } catch {
      toast.error("Unable to save measurement?. Please try again.");
      setEditing(null);
      setIsModalOpen(false);
    }
  };

  const hasMeasurements = !isLoading && measurements?.length === 0;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Measurement management
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Saved measurements
              {isFetching && !isLoading && (
                <span className="ml-3 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Refreshing…
                </span>
              )}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create, edit, and select your preferred size profiles for every
              order.
            </p>
          </div>
          <Button variant="accent" onClick={() => openEditor()}>
            <Plus size={16} /> Add measurement
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {isLoading ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-3">
                <Loader2
                  size={18}
                  className="animate-spin text-muted-foreground"
                />
                <span>Loading saved measurements…</span>
              </div>
            </div>
          ) : hasMeasurements ? (
            <div className="rounded-3xl border border-border bg-muted p-8 text-center">
              <p className="text-lg font-semibold">No measurements yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a measurement profile and it will appear here for orders.
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => openEditor()}>
                  Add first measurement
                </Button>
              </div>
            </div>
          ) : (
            measurements?.map((measurement) => {
              const isExpanded = expandedId === measurement?.id;
              const nonEmptyValues = Object.entries(
                measurement.values ?? {},
              ).filter(([, value]) => value !== "" && value != null);

              return (
                <motion.div
                  key={measurement?.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border bg-card p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-semibold">
                        {measurement?.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {measurement?.unit} · {nonEmptyValues.length} values
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditor(measurement)}
                      className="rounded-full border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {nonEmptyValues
                      .slice(0, isExpanded ? nonEmptyValues.length : 6)
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-2xl border border-border bg-muted p-3"
                        >
                          <div className="text-xs text-muted-foreground">
                            {key}
                          </div>
                          <div className="mt-1 text-sm font-semibold">
                            {value}
                          </div>
                        </div>
                      ))}
                  </div>

                  {nonEmptyValues.length > 6 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : measurement?.id)
                      }
                      className="mt-4 text-sm font-semibold text-primary hover:underline"
                    >
                      {isExpanded
                        ? "Collapse details"
                        : "Show all measurements"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedId(measurement?.id)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {selectedMeasurement.id === measurement?.id && (
                      <Check size={16} />
                    )}
                    {selectedMeasurement.id === measurement?.id
                      ? "Selected for default orders"
                      : "Use this measurement"}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Active measurement
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  {selectedMeasurement.name || "None selected"}
                  {isFetching && !isLoading && (
                    <span className="ml-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" />
                      Syncing…
                    </span>
                  )}
                </h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {selectedMeasurement.unit}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(selectedMeasurement.values ?? {})
                .filter(([, value]) => Boolean(value))
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-border bg-muted p-3"
                  >
                    <div className="text-xs text-muted-foreground">{key}</div>
                    <div className="mt-1 text-sm font-semibold">{value}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-muted p-5 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Tip
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Save measurement sets for each outfit type or tailor. Then choose
              them during order creation without leaving the page.
            </p>
          </div>
        </div>
      </div>

      <MeasurementEditorModal
        open={isModalOpen}
        title={editing ? "Edit measurement" : "Add measurement"}
        measurement={draft}
        onChange={setDraft}
        onSave={saveMeasurement}
        onClose={() => {
          setEditing(null);
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setEditing(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
