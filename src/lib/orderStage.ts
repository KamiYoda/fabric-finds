// Lightweight per-order stage store (sessionStorage backed) so the
// chat banner / summary modal can move through ongoing states without a backend.

export type Stage =
  | "review"           // tailor reviewing (pending)
  | "confirmed"        // tailor confirmed, awaiting payment
  | "awaiting_fabric"  // payment made, customer to send fabrics
  | "fabric_sent"      // customer marked fabrics sent
  | "work_started"     // tailor acknowledged fabrics, work in progress
  | "cutting_done"     // tailor pushed "cutting completed" milestone
  | "ready_for_ack"    // tailor finished and dispatched, awaiting customer acknowledgement
  | "closed";          // customer acknowledged & rated

const KEY = (id: string) => `order:${id}:stage`;
const RATED_KEY = (id: string) => `order:${id}:rated`;

export function getStage(id: string): Stage {
  if (typeof window === "undefined") return "review";
  return (sessionStorage.getItem(KEY(id)) as Stage) || "review";
}

export function setStage(id: string, stage: Stage) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY(id), stage);
  window.dispatchEvent(new CustomEvent("order-stage", { detail: { id, stage } }));
}

export function getRated(id: string): { stars: number; review: string } | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RATED_KEY(id));
  return raw ? JSON.parse(raw) : null;
}

export function setRated(id: string, stars: number, review: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RATED_KEY(id), JSON.stringify({ stars, review }));
}
