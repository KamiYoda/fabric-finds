// Drop-in replacement for buildMeasurementPayload in create.tsx
// Also replaces the normalizeMeasurement function

import type { Measurement } from "../../components/measurement-data";
import type { MeasurementPayload } from "../../lib/api/measurements";

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

export function buildMeasurementPayload(m: Measurement): MeasurementPayload {
  const v = m.values;
  return {
    label: m.name,
    // API accepts "inches" | "cm" only — never "in" or "IN"
    unit: m.unit === "CM" ? "cm" : "inches",
    neck: parseMeasurementNumber(v["Neck"]),
    chest: parseMeasurementNumber(v["Chest"]),
    burst: parseMeasurementNumber(v["Chest/Bust"]),
    shoulder: parseMeasurementNumber(v["Shoulder"]),
    bicep: parseMeasurementNumber(v["Bicep"]), // extra field (index sig)
    arm_length: parseMeasurementNumber(v["Arm length"]),
    sleeve: parseMeasurementNumber(v["Sleeve"]),
    wrist: parseMeasurementNumber(v["Wrist"]), // extra field
    waist_upper: parseMeasurementNumber(v["Waist upper"]),
    waist_lower: parseMeasurementNumber(v["Waist lower"]),
    hips: parseMeasurementNumber(v["Hip"]),
    thigh: parseMeasurementNumber(v["Thigh"]),
    knee: parseMeasurementNumber(v["Knee"]),
    calf: parseMeasurementNumber(v["Calf"]), // extra field
    ankle: parseMeasurementNumber(v["Ankle"]),
    inseam: parseMeasurementNumber(v["Inseam"]),
    trouser_length: parseMeasurementNumber(v["Trouser length"]),
  };
}

// Reverse: API response → Measurement (used in getMeasurements normalization)
export function normalizeMeasurement(item: any): Measurement {
  const name = item.label ?? item.name ?? "Untitled";
  const unit: "IN" | "CM" | "inches" | "cm" =
    String(item.unit ?? "").toLowerCase() === "in" ? "inches" : "cm";

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
