import ill from "../assets/ill.png";
import ill1 from "../assets/ill-1.png";
import ill2 from "../assets/ill-2.png";

export type Measurement = {
  id: string;
  name: string;
  unit: "IN" | "CM" | "inches" | "cm";
  values: Record<string, string>;
};

export const measurementSections = [
  {
    id: "upper-body",
    title: "Upper body",
    description:
      "Capture neck, shoulder, chest and arm measurements for shirts and jackets.",
    imageAlt: "Upper body measurement guide image",
    path: ill,
    fields: [
      "Neck",
      "Shoulder",
      "Chest",
      "Chest/Bust",
      "Bicep",
      "Arm length",
      "Sleeve",
      "Wrist",
    ],
  },
  {
    id: "core-fit",
    title: "Core fit",
    path: ill1,
    description:
      "Measure waist and hips to ensure a comfortable, accurate fit around the torso.",
    imageAlt: "Core fit measurement guide image",
    fields: ["Waist upper", "Waist lower", "Hip"],
  },
  {
    id: "lower-body",
    title: "Lower body",
    path: ill2,
    description:
      "Record thigh, calf, inseam and trouser length for pants, skirts and fitted dresses.",
    imageAlt: "Lower body measurement guide image",
    fields: ["Thigh", "Knee", "Calf", "Ankle", "Inseam", "Trouser length"],
  },
  {
    id: "additional",
    title: "Additional",
    description: "Add head, hand and any extra measurements your tailor needs.",
    imageAlt: "Additional measurements guide image",
    fields: ["Head circumference", "Hand", "Back length"],
  },
];

export const measurementGuideSteps = [
  {
    title: "Neck & shoulders",
    description:
      "Measure around the base of the neck and across the shoulders.",
  },
  {
    title: "Chest / Bust",
    description:
      "Measure the fullest part of the chest or bust with arms relaxed.",
  },
  {
    title: "Waist & hip",
    description: "Measure natural waist and the fullest part of the hips.",
  },
  {
    title: "Arm & length",
    description: "Measure bicep, arm length, and trouser/inseam lengths.",
  },
  {
    title: "Final checks",
    description: "Double-check measurements and record units (IN or CM).",
  },
];

export const defaultMeasurementValues: Measurement["values"] = {
  Neck: '16.4"',
  Shoulder: '15.5"',
  Chest: "",
  "Chest/Bust": '32.0"',
  Bicep: '15.5"',
  "Arm length": '26.5"',
  Sleeve: "",
  Wrist: '7.0"',
  "Waist upper": '32.0"',
  "Waist lower": "",
  Hip: '34.0"',
  Thigh: '20.5"',
  Knee: "",
  Calf: '14.0"',
  Ankle: "",
  Inseam: '30.0"',
  "Trouser length": '41.5"',
  "Head circumference": '22.0"',
  Hand: '8.0"',
  "Back length": '18.0"',
};

export const emptyMeasurement: Measurement = {
  id: "new-measurement",
  name: "",
  unit: "IN",
  values: {
    Neck: "",
    Shoulder: "",
    Chest: "",
    "Chest/Bust": "",
    Bicep: "",
    "Arm length": "",
    Sleeve: "",
    Wrist: "",
    "Waist upper": "",
    "Waist lower": "",
    Hip: "",
    Thigh: "",
    Knee: "",
    Calf: "",
    Ankle: "",
    Inseam: "",
    "Trouser length": "",
    "Head circumference": "",
    Hand: "",
    "Back length": "",
  },
};
