import { apiRequest } from "./core";
import type { Measurement } from "@/components/measurement-data";

export interface MeasurementPayload {
  label: string;
  unit: "inches" | "cm";
  neck?: number | null;
  chest?: number | null;
  burst?: number | null;
  waist_upper?: number | null;
  waist_lower?: number | null;
  hips?: number | null;
  shoulder?: number | null;
  sleeve?: number | null;
  arm_length?: number | null;
  thigh?: number | null;
  knee?: number | null;
  ankle?: number | null;
  inseam?: number | null;
  trouser_length?: number | null;
  [key: string]: unknown;
}

export function getMeasurements() {
  function extractData(r: any) {
    if (Array.isArray(r)) return r;
    if (r && typeof r === "object") {
      if (Array.isArray(r.data)) return r.data;
      if (r.data && typeof r.data === "object" && Array.isArray(r.data.data)) {
        return r.data.data;
      }
    }
    return [];
  }

  function normalize(item: any): Measurement {
    const name = item.label ?? item.name ?? "Untitled";
    const unit: "IN" | "CM" = String(item.unit ?? "").toLowerCase() === "cm" ? "CM" : "IN";

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

  return apiRequest<any>("/measurements", {
    method: "GET",
    auth: true,
  }).then((res) => {
    const data = extractData(res);
    if (!Array.isArray(data)) return [];
    return data.map(normalize);
  });
}

export function getMeasurement(measurementId: string) {
  function normalizeOne(item: any): Measurement | any {
    if (!item || typeof item !== "object") return item;
    const name = item.label ?? item.name ?? "Untitled";
    const unit: "IN" | "CM" = String(item.unit ?? "").toLowerCase() === "cm" ? "CM" : "IN";
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

  return apiRequest<any>(`/measurements/${measurementId}`, {
    method: "GET",
    auth: true,
  }).then((res) => {
    const payload = res && typeof res === "object" && (res.data ?? res) ? (res.data ?? res) : res;
    if (Array.isArray(payload)) return payload.map(normalizeOne);
    return normalizeOne(payload);
  });
}

export function createMeasurement(payload: MeasurementPayload) {
  function extract(r: any) {
    if (Array.isArray(r)) return r;
    if (r && typeof r === "object") {
      if (r.data !== undefined) return r.data;
      if (r.data && r.data.data) return r.data.data;
    }
    return r;
  }

  function normalizeOne(item: any): Measurement | any {
    if (!item || typeof item !== "object") return item;
    const name = item.label ?? item.name ?? "Untitled";
    const unit: "IN" | "CM" = String(item.unit ?? "").toLowerCase() === "cm" ? "CM" : "IN";
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

  return apiRequest<any>("/measurements", {
    method: "POST",
    auth: true,
    body: payload,
    successMessage: "Measurement created",
  }).then((res) => {
    const data = extract(res);
    if (Array.isArray(data)) return data.map(normalizeOne);
    if (data && typeof data === "object") return normalizeOne(data);
    return data;
  });
}

export function updateMeasurement(
  measurementId: string,
  payload: Partial<MeasurementPayload>,
) {
  function extract(r: any) {
    if (Array.isArray(r)) return r;
    if (r && typeof r === "object") {
      if (r.data !== undefined) return r.data;
      if (r.data && r.data.data) return r.data.data;
    }
    return r;
  }

  function normalizeOne(item: any): Measurement | any {
    if (!item || typeof item !== "object") return item;
    const name = item.label ?? item.name ?? "Untitled";
    const unit: "IN" | "CM" = String(item.unit ?? "").toLowerCase() === "cm" ? "CM" : "IN";
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

  return apiRequest<any>(`/measurements/${measurementId}`, {
    method: "PUT",
    auth: true,
    body: payload,
    successMessage: "Measurement updated",
  }).then((res) => {
    const data = extract(res);
    if (Array.isArray(data)) return data.map(normalizeOne);
    if (data && typeof data === "object") return normalizeOne(data);
    return data;
  });
}

export function deleteMeasurement(measurementId: string) {
  return apiRequest<any>(`/measurements/${measurementId}`, {
    method: "DELETE",
    auth: true,
    successMessage: "Measurement deleted",
  });
}
