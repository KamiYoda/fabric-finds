import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./modals/Modal";
import { measurementSections, type Measurement } from "./measurement-data";

type MeasurementEditorModalProps = {
  open: boolean;
  title?: string;
  measurement: Measurement;
  onChange: (next: Measurement) => void;
  onSave: () => void;
  onClose: () => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function MeasurementEditorModal({
  open,
  title,
  measurement,
  onChange,
  onSave,
  onClose,
  onCancel,
  submitLabel = "Save measurement",
}: MeasurementEditorModalProps) {
  const [step, setStep] = useState(0);
  const [extraFieldLabel, setExtraFieldLabel] = useState("");
  const [extraFieldValue, setExtraFieldValue] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setExtraFieldLabel("");
    setExtraFieldValue("");
  }, [open]);

  const reviewStep = step === measurementSections.length;
  const currentSection = measurementSections[step];

  const baseFieldKeys = useMemo(
    () => measurementSections.flatMap((section) => section.fields),
    [],
  );

  const extraFieldKeys = useMemo(
    () =>
      Object.keys(measurement.values).filter(
        (field) => !baseFieldKeys.includes(field),
      ),
    [measurement.values, baseFieldKeys],
  );

  const sectionFields =
    currentSection?.id === "additional"
      ? [...currentSection?.fields, ...extraFieldKeys]
      : (currentSection?.fields ?? []);

  const customFieldLabel = extraFieldLabel.trim();
  const customFieldValue = extraFieldValue.trim();
  const canAddField =
    customFieldLabel.length > 0 &&
    customFieldValue.length > 0 &&
    !Object.keys(measurement.values).includes(customFieldLabel);

  const handleAddField = () => {
    if (!canAddField) return;
    onChange({
      ...measurement,
      values: {
        ...measurement.values,
        [customFieldLabel]: customFieldValue,
      },
    });
    setExtraFieldLabel("");
    setExtraFieldValue("");
  };

  const cancelAction = onCancel ?? onClose;

  return (
    <Modal
      open={open}
      onClose={cancelAction}
      title={title ?? (reviewStep ? "Review measurement" : "Add measurement")}
      size="xl"
      footer={
        <div className="mt-2 flex flex-wrap gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={cancelAction}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={reviewStep && !measurement.name.trim()}
            onClick={() => {
              if (reviewStep) {
                onSave();
              } else {
                setStep(step + 1);
              }
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewStep ? submitLabel : "Next"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        Complete each section and review all values before saving.
      </p>
      <div className="mt-4 mb-4">
        <label>Measurment Name</label>
        <Input
          value={measurement.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...measurement, name: event.target.value })
          }
          placeholder="e.g. My first measurement"
        />
      </div>

      {/* Mobile tab selector */}
      <div className="mt-5 flex gap-1 rounded-full bg-muted p-1 lg:hidden">
        {measurementSections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setStep(index)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all ${
              step === index
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.title}
          </button>
        ))}
        <button
          onClick={() => setStep(measurementSections.length)}
          className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all ${
            reviewStep
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Review
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop section selector */}
        <div className="hidden lg:flex flex-col gap-2">
          {measurementSections.map((section, index) => (
            <>
              <button
                key={section.id}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  step === index
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                <div>{section.title}</div>
              </button>
              {step === index && (
                <p className="mt-1 ml-2 text-xs font-normal text-muted-foreground">
                  {section.description}
                </p>
              )}
            </>
          ))}
          <button
            type="button"
            onClick={() => setStep(measurementSections.length)}
            className={`rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
              reviewStep
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card hover:border-primary"
            }`}
          >
            <div>Review</div>
          </button>
        </div>

        {/* Main content area */}
        <div className="space-y-4">
          {reviewStep ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold">Review measurement</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check each section and edit any values before saving.
                </p>
                <div className="mt-4 rounded-3xl border border-border bg-muted p-5">
                  <div className="text-sm text-muted-foreground">
                    Profile name
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    {measurement.name || "Unnamed profile"}
                  </div>
                </div>
              </div>

              {measurementSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-3xl border border-border bg-muted p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-accent">
                        {section.title}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">
                        {section.title}
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setStep(
                          measurementSections.findIndex(
                            (item) => item.id === section.id,
                          ),
                        )
                      }
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      ...section.fields,
                      ...(section.id === "additional" ? extraFieldKeys : []),
                    ].map((field) => (
                      <div
                        key={field}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="text-xs text-muted-foreground">
                          {field}
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                          {measurement.values[field] || "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">
                    {currentSection?.title}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {currentSection?.title} details
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {currentSection?.title}
                </span>
              </div>

              {currentSection?.id !== "additional" && (
                <div className="mt-5 rounded-3xl border border-dashed border-border bg-muted p-4 text-center text-sm text-muted-foreground">
                  <img
                    src={currentSection?.path}
                    alt={currentSection?.imageAlt}
                  />
                  {currentSection?.imageAlt}
                </div>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                {currentSection?.description}
              </div>

              <div className="mt-6 grid gap-4">
                {sectionFields.map((field) => (
                  <div
                    key={field}
                    className="rounded-3xl border border-border bg-muted p-4"
                  >
                    <label className="text-xs text-muted-foreground">
                      {field}
                    </label>
                    <Input
                      value={measurement.values[field] || ""}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onChange({
                          ...measurement,
                          values: {
                            ...measurement.values,
                            [field]: event.target.value,
                          },
                        })
                      }
                      placeholder='e.g. 16.4"'
                    />
                  </div>
                ))}
              </div>

              {currentSection?.id === "additional" && (
                <div className="mt-4 rounded-3xl border border-border bg-muted p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Field label"
                      value={extraFieldLabel}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setExtraFieldLabel(event.target.value)
                      }
                      placeholder="e.g. Shoulder width"
                    />
                    <Input
                      label="Value"
                      value={extraFieldValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setExtraFieldValue(event.target.value)
                      }
                      placeholder='e.g. 18.2"'
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={handleAddField}
                      disabled={!canAddField}
                    >
                      Add custom field
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
