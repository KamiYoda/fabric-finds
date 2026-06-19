import { createFileRoute } from "@tanstack/react-router";
import { MeasurementManager } from "../../components/MeasurementManager";

export const Route = createFileRoute("/dashboard/measurements")({
  component: MeasurementsPage,
});

function MeasurementsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-0">
      <MeasurementManager />
    </div>
  );
}
