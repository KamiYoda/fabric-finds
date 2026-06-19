import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Search,
  MapPin,
  Edit3,
  Star,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
  MeasurementGuide,
  type Measurement,
} from "../../components/MeasurementManager";
import { MeasurementEditorModal } from "../../components/MeasurementEditorModal";
import { TailorProfileModal } from "../../components/modals/TailorProfileModal";
import {
  createOrder,
  updateOrder,
  sendOrderToTailor,
  getOrder,
  type OrderPayload,
  type StyleDetail,
} from "../../lib/api/orders";
import { getMeasurements, createMeasurement } from "../../lib/api/measurements";
import { getTailors } from "../../lib/api/tailors";
import {
  getOutfitCategories,
  getOutfitStyles,
  type OutfitCategory,
  type OutfitStyle,
} from "../../lib/api/outfit-category";
import { uploadFile } from "../../lib/api/upload";
import { buildMeasurementPayload } from "@/components/BuildMeasurementPayload";

export const Route = createFileRoute("/dashboard/create")({
  head: () => ({ meta: [{ title: "Create custom outfit — i-sew" }] }),
  validateSearch: (search: Record<string, any>) => ({
    tailor_id: search.tailor_id as string | undefined,
    draft_id: search.draft_id as string | undefined,
  }),
  component: CreateOrderPage,
});

const steps = [
  "Outfit category",
  "Style builder",
  "Style reference",
  "Choose tailor",
  "Delivery details",
];

const styleAttributes = [
  {
    key: "neck",
    attribute: "collar_type",
    label: "Neck style",
    options: ["Buttoned", "Round", "V-neck", "Mandarin"],
  },
  {
    key: "fit",
    attribute: "fit",
    label: "Fit",
    options: ["Slim", "Regular", "Relaxed"],
  },
  {
    key: "sleeve",
    attribute: "sleeve_length",
    label: "Sleeve",
    options: ["Short", "Three-quarter", "Long"],
  },
  {
    key: "length",
    attribute: "outfit_length",
    label: "Length",
    options: ["Short", "Regular", "Long"],
  },
];

const measurementFieldMap: Array<[string, string]> = [
  ["Neck", "neck"],
  ["Shoulder", "shoulder"],
  ["Chest/Bust", "burst"],
  ["Bicep", "bicep"],
  ["Arm length", "arm_length"],
  ["Waist", "waist_upper"],
  ["Hip", "hips"],
  ["Thigh", "thigh"],
  ["Calf", "calf"],
  ["Inseam", "inseam"],
  ["Trouser length", "trouser_length"],
];

const emptyValues: Record<string, string> = Object.fromEntries(
  measurementFieldMap.map(([label]) => [label, ""]),
);

function normalizeMeasurement(item: any): Measurement {
  const name =
    item?.label ?? item?.name ?? item?.measurement_name ?? "Untitled";
  const unit = item?.unit?.toUpperCase?.() === "CM" ? "CM" : "IN";
  const values: Record<string, string> = { ...emptyValues };
  for (const [label, key] of measurementFieldMap) {
    const v =
      item?.values?.[label] ??
      item?.values?.[key] ??
      item[label] ??
      item[key] ??
      item[label.toLowerCase()];
    if (v !== undefined && v !== null) values[label] = String(v);
  }
  return { id: item?.id ?? `${name}-${Date.now()}`, name, unit, values };
}

const emptyCustomMeasurement: Measurement = {
  id: "new-measurement",
  name: "",
  unit: "IN",
  values: { ...emptyValues },
};

// ── Hydrate attrs from style_details array ────────────────────────────────
function hydrateAttrs(styleDetails: StyleDetail[]): Record<string, number> {
  const defaults = { neck: 0, fit: 1, sleeve: 2, length: 2 };
  if (!styleDetails?.length) return defaults;
  const result = { ...defaults };
  for (const detail of styleDetails) {
    const attr = styleAttributes.find((a) => a.attribute === detail.attribute);
    if (attr) {
      const idx = attr.options.findIndex(
        (o) => o.toLowerCase() === detail.value.toLowerCase(),
      );
      if (idx >= 0) (result as any)[attr.key] = idx;
    }
  }
  return result;
}

// ── Re-export normalizeTailorList for use in Step4 above ──────────────────
function normalizeTailorList(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

// ─── Component ────────────────────────────────────────────────────────────
function CreateOrderPage() {
  const router = useRouter();
  const { tailor_id, draft_id } = Route.useSearch();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  // Show a loading screen while we hydrate tailor/draft data from the API
  const [isInitializing, setIsInitializing] = useState(
    !!(tailor_id || draft_id),
  );

  // ── Step 1 ──
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);

  // ── Step 2 ──
  const [attrs, setAttrs] = useState<Record<string, number>>({
    neck: 0,
    fit: 1,
    sleeve: 2,
    length: 2,
  });
  const [measurementMode, setMeasurementMode] = useState<"select" | "new">(
    "select",
  );
  const [selectedMeasurementId, setSelectedMeasurementId] =
    useState<string>("");
  const [customMeasurement, setCustomMeasurement] = useState<Measurement>(
    emptyCustomMeasurement,
  );
  const [isSavingMeasurement, setIsSavingMeasurement] = useState(false);

  // ── Step 3 ──
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [notes, setNotes] = useState("");

  // ── Step 4 ──
  const [selectedTailor, setSelectedTailor] = useState<any>(null);
  const [profileTailor, setProfileTailor] = useState<any>(null);

  // ── Step 5 ──
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [region, setRegion] = useState("");
  const [fabricProvider, setFabricProvider] = useState<"customer" | "tailor">(
    "tailor",
  );

  // ── Submit / send state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sendCalledRef = useRef(false);

  // ── Draft edit mode ──
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["outfit-categories"],
    queryFn: getOutfitCategories,
    staleTime: Infinity,
  });

  const { data: styles = [], isLoading: loadingStyles } = useQuery({
    queryKey: ["outfit-styles", selectedCategoryId],
    queryFn: () => getOutfitStyles(selectedCategoryId!),
    enabled: selectedCategoryId !== null,
    staleTime: Infinity,
  });

  const { data: measurementsData = [], refetch: refetchMeasurements } =
    useQuery({
      queryKey: ["measurements"],
      queryFn: async () => {
        try {
          const result = await getMeasurements();
          return Array.isArray(result) ? result.map(normalizeMeasurement) : [];
        } catch {
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
    });

  // ── Initialise from tailor_id param ──────────────────────────────────────
  // Pre-selects the tailor but ALWAYS starts at step 0 — normal create flow.
  useEffect(() => {
    if (!tailor_id) return;
    setIsInitializing(true);
    getTailors({ per_page: 100 })
      .then((res: any) => {
        const list = normalizeTailorList(res);
        const tailor = list.find(
          (t: any) => String(t.id) === String(tailor_id),
        );
        if (tailor) setSelectedTailor(tailor);
      })
      .catch(() => {
        // non-fatal — tailor just won't be pre-selected
      })
      .finally(() => setIsInitializing(false));
  }, [tailor_id]);

  // ── Initialise from draft_id param ───────────────────────────────────────
  useEffect(() => {
    if (!draft_id) return;
    setIsInitializing(true);
    getOrder(draft_id)
      .then((res: any) => {
        const o = res?.data ?? res;
        setEditingDraftId(String(o.id));

        if (o.gender) setGender(o.gender);
        if (o.outfit_category_id)
          setSelectedCategoryId(Number(o.outfit_category_id));
        if (o.outfit_style_id) setSelectedStyleId(Number(o.outfit_style_id));
        if (o.style_details) setAttrs(hydrateAttrs(o.style_details));
        if (o.measurement_id)
          setSelectedMeasurementId(String(o.measurement_id));
        if (Array.isArray(o.style_reference_photos))
          setReferencePhotos(o.style_reference_photos);
        if (o.notes_for_tailor) setNotes(o.notes_for_tailor);
        if (o.phone_number) setPhoneNumber(o.phone_number);
        if (o.delivery_address) setDeliveryAddress(o.delivery_address);
        if (o.region) setRegion(o.region);
        if (o.fabric_provider) setFabricProvider(o.fabric_provider);

        // Tailor: prefer embedded object, fall back to fetching by id
        if (o.tailor && o.tailor.id) {
          setSelectedTailor(o.tailor);
          setIsInitializing(false);
        } else if (o.tailor_id) {
          getTailors({ per_page: 100 })
            .then((tailorRes: any) => {
              const list = normalizeTailorList(tailorRes);
              const tailor = list.find(
                (t: any) => String(t.id) === String(o.tailor_id),
              );
              if (tailor) setSelectedTailor(tailor);
            })
            .finally(() => setIsInitializing(false));
        } else {
          setIsInitializing(false);
        }
      })
      .catch(() => {
        toast.error("Failed to load draft order");
        setIsInitializing(false);
      });
  }, [draft_id]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredCategories = gender
    ? categories.filter((c: OutfitCategory) => {
        if (!c.gender) return true;
        return c.gender.toLowerCase() === gender.toLowerCase();
      })
    : categories;

  const styleDetails: StyleDetail[] = styleAttributes.map((a) => ({
    attribute: a.attribute,
    value: a.options[attrs[a.key]].toLowerCase(),
  }));

  const selectedCategory = categories.find(
    (c: OutfitCategory) => c.id === selectedCategoryId,
  );
  const selectedStyle = styles.find(
    (s: OutfitStyle) => s.id === selectedStyleId,
  );

  // ── Per-step validation ───────────────────────────────────────────────────
  const canNext = (() => {
    if (step === 0)
      return Boolean(gender && selectedCategoryId && selectedStyleId);
    if (step === 1) return Boolean(selectedMeasurementId);
    if (step === 4) return Boolean(phoneNumber && deliveryAddress && region);
    return true;
  })();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () =>
    step === 0 ? router.history.back() : setStep((s) => Math.max(s - 1, 0));

  // ── Save inline measurement ───────────────────────────────────────────────
  const handleSaveMeasurement = async () => {
    if (!customMeasurement.name.trim()) {
      toast.error("Give your measurement a name");
      return;
    }
    setIsSavingMeasurement(true);
    try {
      const created = await createMeasurement(
        buildMeasurementPayload(customMeasurement),
      );
      const id = created?.id ?? created?.data?.id;
      if (!id) throw new Error("No id returned");
      await refetchMeasurements();
      setSelectedMeasurementId(String(id));
      setMeasurementMode("select");
      toast.success("Measurement saved");
    } catch {
      toast.error("Failed to save measurement");
    } finally {
      setIsSavingMeasurement(false);
    }
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const result = await uploadFile(file, "style_reference");
      setReferencePhotos((prev) => [...prev, result.url]);
    } catch {
      toast.error("Photo upload failed");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedCategoryId || !selectedStyleId || !selectedMeasurementId) {
      toast.error("Missing required fields");
      return;
    }
    // Guard against double-submit
    if (sendCalledRef.current) return;

    setIsSubmitting(true);

    const payload: OrderPayload = {
      title:
        `${selectedCategory?.name ?? "Custom"} — ${selectedStyle?.name ?? ""}`.trim(),
      gender,
      outfit_category_id: selectedCategoryId,
      outfit_style_id: selectedStyleId,
      style_details: styleDetails,
      measurement_id: selectedMeasurementId,
      fabric_provider: fabricProvider,
      style_reference_photos: referencePhotos,
      phone_number: phoneNumber,
      delivery_address: deliveryAddress,
      region,
      notes_for_tailor: notes,
      tailor_id: selectedTailor?.id ?? null,
    };

    try {
      let orderId: string;

      if (editingDraftId) {
        // Update existing draft via PUT
        await updateOrder(editingDraftId, payload);
        orderId = editingDraftId;
      } else {
        // Create fresh order
        const created = await createOrder(payload);
        orderId = String(created?.data?.id ?? created?.id ?? "");
        if (!orderId) throw new Error("No order id returned from server");
      }

      // ── Send to tailor if one is selected ────────────────────────────────
      if (selectedTailor?.id) {
        sendCalledRef.current = true;
        setIsSending(true);
        try {
          await sendOrderToTailor(orderId, selectedTailor.id);
          toast.success(
            editingDraftId ? "Draft updated & sent" : "Order created & sent",
            {
              description: `${selectedTailor.name ?? selectedTailor.business_name} will respond shortly.`,
            },
          );
        } catch {
          // Order was saved; only the send step failed — warn, don't block.
          toast.warning("Order saved but could not be sent to tailor.", {
            description: "You can retry from your orders page.",
          });
        } finally {
          setIsSending(false);
        }
      } else {
        // No tailor — order stays as draft
        toast.success(
          editingDraftId ? "Draft updated" : "Order saved as draft",
          { description: "You can assign a tailor from your orders." },
        );
      }

      // Invalidate orders list so Drafts tab refreshes
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setTimeout(() => router.navigate({ to: "/dashboard/orders" }), 600);
    } catch {
      toast.error("Failed to save order. Please try again.");
      setIsSubmitting(false);
      sendCalledRef.current = false;
    }
  };

  // ── Loading screen while hydrating from URL params ────────────────────────
  if (isInitializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={prev} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-2xl font-bold">
          {editingDraftId ? "Edit draft order" : "Create custom outfit"}
        </h1>
      </div>

      {/* Tailor pre-selection banner — visible on steps 0–3 */}
      {selectedTailor && step < 4 && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          {selectedTailor.avatar || selectedTailor.profile_photo ? (
            <img
              src={selectedTailor.avatar ?? selectedTailor.profile_photo}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-xs font-bold text-primary-foreground">
              {(selectedTailor.name ?? selectedTailor.business_name ?? "T")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium">
            Ordering from{" "}
            <span className="text-primary">
              {selectedTailor.name ?? selectedTailor.business_name}
            </span>
          </span>
          <button
            onClick={() => setSelectedTailor(null)}
            className="ml-auto rounded-full p-1 text-muted-foreground hover:text-foreground"
            aria-label="Remove selected tailor"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Stepper */}
      <div className="mt-4">
        <div className="text-sm font-medium text-accent">
          Step {step + 1}/{steps.length}
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <motion.div
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-accent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <Step1
                gender={gender}
                setGender={(g: "male" | "female") => {
                  setGender(g);
                  setSelectedCategoryId(null);
                  setSelectedStyleId(null);
                }}
                categories={filteredCategories}
                loadingCategories={loadingCategories}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={(id: number) => {
                  setSelectedCategoryId(id);
                  setSelectedStyleId(null);
                }}
                styles={styles}
                loadingStyles={loadingStyles}
                selectedStyleId={selectedStyleId}
                setSelectedStyleId={setSelectedStyleId}
              />
            )}
            {step === 1 && (
              <Step2
                attrs={attrs}
                setAttrs={setAttrs}
                categoryName={selectedCategory?.name ?? ""}
                measurementMode={measurementMode}
                setMeasurementMode={setMeasurementMode}
                measurements={measurementsData}
                selectedMeasurementId={selectedMeasurementId}
                setSelectedMeasurementId={setSelectedMeasurementId}
                customMeasurement={customMeasurement}
                setCustomMeasurement={setCustomMeasurement}
                onSaveMeasurement={handleSaveMeasurement}
                isSavingMeasurement={isSavingMeasurement}
              />
            )}
            {step === 2 && (
              <Step3
                referencePhotos={referencePhotos}
                setReferencePhotos={setReferencePhotos}
                onUpload={handlePhotoUpload}
                isUploading={isUploadingPhoto}
                notes={notes}
                setNotes={setNotes}
              />
            )}
            {step === 3 && (
              <Step4
                selectedTailor={selectedTailor}
                setSelectedTailor={setSelectedTailor}
                profileTailor={profileTailor}
                setProfileTailor={setProfileTailor}
                outfitCategoryId={selectedCategoryId}
              />
            )}
            {step === 4 && (
              <Step5
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                region={region}
                setRegion={setRegion}
                fabricProvider={fabricProvider}
                setFabricProvider={setFabricProvider}
                order={{
                  category: selectedCategory?.name ?? "—",
                  style: selectedStyle?.name ?? "—",
                  styleDetails,
                  measurementId: selectedMeasurementId,
                  measurementName:
                    measurementsData.find(
                      (m: Measurement) => m.id === selectedMeasurementId,
                    )?.name ?? "—",
                  photos: referencePhotos,
                  notes,
                  tailor: selectedTailor,
                }}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting || isSending}
                isEditing={!!editingDraftId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <div className="mt-6 flex items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={prev}>
            <ChevronLeft size={16} /> Previous
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 && (
          <Button variant="primary" onClick={next} disabled={!canNext}>
            Next <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Modals */}
      <TailorProfileModal
        isOpen={!!profileTailor}
        onClose={() => setProfileTailor(null)}
        tailor={profileTailor}
        onOrder={(tailor: any) => {
          setSelectedTailor(tailor);
          setProfileTailor(null);
          next();
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 1 — Outfit category + style
───────────────────────────────────────────────────────────────────────── */
function Step1({
  gender,
  setGender,
  categories,
  loadingCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  styles,
  loadingStyles,
  selectedStyleId,
  setSelectedStyleId,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Outfit category</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select gender, category, and style.
        </p>
      </div>

      {/* Gender */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Gender</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <Pill key={g} active={gender === g} onClick={() => setGender(g)}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Pill>
          ))}
        </div>
      </div>

      {/* Categories */}
      {gender && (
        <div>
          <label className="mb-3 block text-sm font-medium">
            What would you like to make?
          </label>
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Loading categories…
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories available.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((c: OutfitCategory) => {
                const active = selectedCategoryId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.name}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-muted to-secondary" />
                    )}
                    <div className="mt-2 text-sm font-medium">{c.name}</div>
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      {selectedCategoryId && (
        <div>
          <label className="mb-3 block text-sm font-medium">
            Select a style
          </label>
          {loadingStyles ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Loading styles…
            </div>
          ) : styles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No styles available for this category.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {styles.map((s: OutfitStyle) => {
                const active = selectedStyleId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyleId(s.id)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    {s.image_url ? (
                      <img
                        src={s.image_url}
                        alt={s.name}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-accent/20 to-secondary" />
                    )}
                    <div className="mt-2 text-sm font-medium">{s.name}</div>
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 2 — Style builder + measurements
───────────────────────────────────────────────────────────────────────── */
function Step2({
  attrs,
  setAttrs,
  categoryName,
  measurementMode,
  setMeasurementMode,
  measurements,
  selectedMeasurementId,
  setSelectedMeasurementId,
  customMeasurement,
  setCustomMeasurement,
  onSaveMeasurement,
  isSavingMeasurement,
}: any) {
  const selectedMeasurement = measurements?.find(
    (m: Measurement) => m.id === selectedMeasurementId,
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">
          Style builder{" "}
          <span className="text-sm font-normal text-muted-foreground">
            (Attribute selection)
          </span>
        </h2>
      </div>

      {/* Style attributes */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-secondary p-8">
          <div className="font-display text-lg text-muted-foreground">
            {categoryName || "Preview"}
          </div>
        </div>
        <div className="space-y-3">
          {styleAttributes.map((a) => (
            <div
              key={a.key}
              className="rounded-2xl border border-border bg-muted/40 p-3"
            >
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                {a.label}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <button
                  onClick={() =>
                    setAttrs({
                      ...attrs,
                      [a.key]:
                        (attrs[a.key] - 1 + a.options.length) %
                        a.options.length,
                    })
                  }
                  className="rounded-full p-1.5 hover:bg-card"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-semibold">
                  {a.options[attrs[a.key]]}
                </div>
                <button
                  onClick={() =>
                    setAttrs({
                      ...attrs,
                      [a.key]: (attrs[a.key] + 1) % a.options.length,
                    })
                  }
                  className="rounded-full p-1.5 hover:bg-card"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement section */}
      <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Measurement profile
            </label>
            <p className="text-sm text-muted-foreground">
              Select a saved profile or create a new one.
            </p>
          </div>
          <div className="flex gap-2">
            <Pill
              active={measurementMode === "select"}
              onClick={() => setMeasurementMode("select")}
            >
              Saved
            </Pill>
            <Pill
              active={measurementMode === "new"}
              onClick={() => setMeasurementMode("new")}
            >
              New
            </Pill>
          </div>
        </div>

        {measurementMode === "select" ? (
          <>
            {measurements?.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                No saved measurements.{" "}
                <button
                  className="text-primary underline-offset-2 hover:underline"
                  onClick={() => setMeasurementMode("new")}
                >
                  Add one now.
                </button>
              </div>
            ) : (
              <select
                value={selectedMeasurementId}
                onChange={(e) => setSelectedMeasurementId(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Select a measurement profile</option>
                {measurements?.map((m: Measurement) => (
                  <option key={m?.id} value={m?.id}>
                    {m?.name}
                  </option>
                ))}
              </select>
            )}

            {selectedMeasurement && (
              <div className="mt-2 rounded-3xl border border-border bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {selectedMeasurement.name}
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {selectedMeasurement.unit}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(
                    Object.entries(selectedMeasurement.values) as [
                      string,
                      string,
                    ][]
                  )
                    .slice(0, 6)
                    .map(([field, value]) => (
                      <div
                        key={field}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="text-xs text-muted-foreground">
                          {field}
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                          {value || "—"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <MeasurementEditorModal
            open
            title="New measurement"
            measurement={customMeasurement}
            onChange={setCustomMeasurement}
            onSave={onSaveMeasurement}
            onClose={() => setMeasurementMode("select")}
            onCancel={() => setMeasurementMode("select")}
            submitLabel={isSavingMeasurement ? "Saving…" : "Save measurement"}
          />
        )}

        <MeasurementGuide />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 3 — Style reference photos + notes
───────────────────────────────────────────────────────────────────────── */
function Step3({
  referencePhotos,
  setReferencePhotos,
  onUpload,
  isUploading,
  notes,
  setNotes,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Style reference</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload photos to show the tailor what you have in mind (optional).
        </p>
      </div>

      {/* Upload area */}
      <div>
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isUploading
              ? "border-primary/30 bg-primary/5"
              : "border-primary/40 bg-primary/5 hover:bg-primary/10"
          }`}
          onClick={() => !isUploading && inputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-primary" />
              <span className="mt-2 text-sm font-medium text-primary">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <Upload size={28} className="text-primary" />
              <span className="mt-2 text-sm font-medium text-primary">
                Upload style reference
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG or WebP · max 10 MB
              </span>
            </>
          )}
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* Uploaded photos */}
      {referencePhotos.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-medium">
            Uploaded photos ({referencePhotos.length})
          </div>
          <div className="grid grid-cols-3 gap-3">
            {referencePhotos.map((url: string, i: number) => (
              <div key={i} className="group relative aspect-square">
                <img
                  src={url}
                  alt=""
                  className="h-full w-full rounded-2xl object-cover"
                />
                <button
                  onClick={() =>
                    setReferencePhotos((prev: string[]) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  className="absolute right-1.5 top-1.5 hidden rounded-full bg-card/80 p-1 shadow group-hover:flex"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Notes for tailor{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any specific instructions, fabric preferences, etc…"
          className="w-full rounded-xl border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 4 — Choose tailor
───────────────────────────────────────────────────────────────────────── */
function Step4({
  selectedTailor,
  setSelectedTailor,
  profileTailor,
  setProfileTailor,
  outfitCategoryId,
}: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [debouncedRegion, setDebouncedRegion] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedRegion(regionFilter), 400);
    return () => clearTimeout(t);
  }, [regionFilter]);

  const {
    data: tailors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tailors", { region: debouncedRegion, outfitCategoryId }],
    queryFn: () =>
      getTailors({
        region: debouncedRegion || undefined,
        outfit_category_id: outfitCategoryId
          ? String(outfitCategoryId)
          : undefined,
        per_page: 20,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const tailorList: any[] = normalizeTailorList(tailors);

  const filtered = searchQuery.trim()
    ? tailorList.filter(
        (t) =>
          (t?.name ?? t?.business_name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (t?.shop_name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : tailorList;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Choose a tailor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a tailor or skip — you can assign one later.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or shop"
            className="h-11 w-full rounded-2xl border border-border bg-muted/40 pl-9 pr-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="relative">
          <MapPin
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            placeholder="Filter by region (e.g. Lagos)"
            className="h-11 w-full rounded-2xl border border-border bg-muted/40 pl-9 pr-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" /> Loading tailors…
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          Failed to load tailors. Check your connection.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          {searchQuery || regionFilter
            ? "No tailors match your search."
            : "No tailors available right now."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t: any, i: number) => {
            const name = t?.name ?? t?.business_name ?? "Tailor";
            const shop = t?.shop_name ?? t?.bio ?? "";
            const location = t?.region ?? t?.location ?? "";
            const rating = t?.rating ?? t?.average_rating ?? null;
            const isSelected = selectedTailor?.id === t?.id;

            return (
              <motion.button
                key={t?.id ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: i * 0.03 }}
                onClick={() => setProfileTailor(t)}
                className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:shadow-soft ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-muted/50 hover:bg-muted"
                }`}
              >
                {t?.avatar || t?.profile_photo ? (
                  <img
                    src={t?.avatar ?? t?.profile_photo}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-sm font-bold text-primary-foreground">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-semibold">
                      {name}
                    </span>
                    {t?.verified && (
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-primary"
                      />
                    )}
                  </div>
                  {shop && (
                    <div className="truncate text-xs text-muted-foreground">
                      {shop}
                    </div>
                  )}
                  {location && (
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={10} /> {location}
                    </div>
                  )}
                </div>
                {rating !== null && (
                  <div className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Star size={13} className="fill-accent text-accent" />
                    {Number(rating).toFixed(1)}
                  </div>
                )}
                {isSelected && (
                  <Check size={16} className="shrink-0 text-primary" />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Skip option */}
      <button
        onClick={() => setSelectedTailor(null)}
        className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Skip — assign tailor later
      </button>

      {/* Selected confirmation */}
      {selectedTailor && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary" />
            <span className="text-sm font-semibold">
              {selectedTailor.name ?? selectedTailor.business_name} selected
            </span>
            <button
              onClick={() => setSelectedTailor(null)}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Step 5 — Delivery details + review + submit
───────────────────────────────────────────────────────────────────────── */
function Step5({
  phoneNumber,
  setPhoneNumber,
  deliveryAddress,
  setDeliveryAddress,
  region,
  setRegion,
  fabricProvider,
  setFabricProvider,
  order,
  onSubmit,
  isSubmitting,
  isEditing,
}: any) {
  const tailor = order.tailor;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Delivery details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Where should we deliver your finished outfit?
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Phone number"
          value={phoneNumber}
          onChange={(e: any) => setPhoneNumber(e.target.value)}
          placeholder="+234 801 234 5678"
        />
        <Input
          label="Delivery address"
          value={deliveryAddress}
          onChange={(e: any) => setDeliveryAddress(e.target.value)}
          placeholder="15 Example Street, Lagos"
        />
        <Input
          label="Region"
          value={region}
          onChange={(e: any) => setRegion(e.target.value)}
          placeholder="e.g. Lagos, Abuja, Port Harcourt"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Who provides the fabric?
          </label>
          <div className="flex gap-2">
            <Pill
              active={fabricProvider === "tailor"}
              onClick={() => setFabricProvider("tailor")}
            >
              Tailor provides
            </Pill>
            <Pill
              active={fabricProvider === "customer"}
              onClick={() => setFabricProvider("customer")}
            >
              I provide
            </Pill>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="space-y-4 rounded-3xl border border-border bg-muted p-5">
        <h3 className="font-semibold">Order summary</h3>
        <SummaryRow label="Category" value={order.category} />
        <SummaryRow label="Style" value={order.style} />
        <SummaryRow label="Measurement" value={order.measurementName} />
        <SummaryRow
          label="Fabric"
          value={
            fabricProvider === "tailor"
              ? "Tailor-provided"
              : "Customer-provided"
          }
        />
        <SummaryRow
          label="Style details"
          value={order.styleDetails
            .map((d: StyleDetail) => `${d.attribute}: ${d.value}`)
            .join(" · ")}
        />
        {order.photos.length > 0 && (
          <SummaryRow
            label="Reference photos"
            value={`${order.photos.length} uploaded`}
          />
        )}
        {order.notes && <SummaryRow label="Notes" value={order.notes} />}

        {/* Tailor card */}
        <div className="pt-1">
          <div className="mb-2 text-sm text-muted-foreground">Tailor</div>
          {tailor ? (
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
              {tailor.avatar || tailor.profile_photo ? (
                <img
                  src={tailor.avatar ?? tailor.profile_photo}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-sm font-bold text-primary-foreground">
                  {(tailor.name ?? tailor.business_name ?? "T")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-semibold">
                    {tailor.name ?? tailor.business_name}
                  </span>
                  {tailor.verified && (
                    <CheckCircle2 size={12} className="shrink-0 text-primary" />
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {(tailor.region ?? tailor.location) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {tailor.region ?? tailor.location}
                    </span>
                  )}
                  {(tailor.rating ?? tailor.average_rating) != null && (
                    <span className="flex items-center gap-1">
                      <Star size={10} className="fill-accent text-accent" />
                      {Number(tailor.rating ?? tailor.average_rating).toFixed(
                        1,
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tailor selected — order will be saved as draft.
            </p>
          )}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onSubmit}
        disabled={isSubmitting || !phoneNumber || !deliveryAddress || !region}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {tailor ? "Sending to tailor…" : "Saving draft…"}
          </>
        ) : (
          <>
            {isEditing && !tailor
              ? "Update order"
              : tailor
                ? "Submit & send to tailor"
                : "Save as draft"}
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared Pill
───────────────────────────────────────────────────────────────────────── */
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-muted text-muted-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
