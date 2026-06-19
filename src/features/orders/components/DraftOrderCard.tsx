import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Edit3, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOrder } from "@/lib/api/orders";
import { Modal } from "../../../components/modals/Modal";
import { Button } from "@/components/ui/button";

interface DraftOrderCardProps {
  order: {
    id: string | number;
    title?: string;
    created_at?: string;
    tailor?: { name?: string; business_name?: string } | null;
    tailor_id?: string | number | null;
  };
  /** Called after a successful delete so the parent can remove the item optimistically */
  onDeleted?: () => void;
}

export function DraftOrderCard({ order, onDeleted }: DraftOrderCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCalledRef = useRef(false);

  const handleEdit = () => {
    router.navigate({
      to: "/dashboard/create",
      search: { draft_id: String(order.id) },
    });
  };

  const handleDelete = async () => {
    // Guard against duplicate requests
    if (deleteCalledRef.current) return;
    deleteCalledRef.current = true;
    setIsDeleting(true);
    try {
      await deleteOrder(String(order.id));
      toast.success("Draft deleted");
      // Remove from cache immediately
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onDeleted?.();
    } catch {
      toast.error("Failed to delete draft. Please try again.");
      deleteCalledRef.current = false;
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  const tailorName = order.tailor?.name ?? order.tailor?.business_name ?? null;

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-4 shadow-soft transition-all hover:translate-y-0.5 hover:shadow-elegant">
        {/* Order info */}
        <div className="min-w-0  flex-1">
          <div className="truncate text-sm font-semibold">
            {order.title ?? "Untitled draft"}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
              Draft
            </span>
            {order.created_at && (
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            )}
            {tailorName && <span className="text-primary">→ {tailorName}</span>}
            {!tailorName && order.tailor_id == null && (
              <span className="italic">No tailor assigned</span>
            )}
          </div>
        </div>

        {/* Actions — only for draft orders */}
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            <Edit3 size={12} />
            Edit
          </button>
          <button
            onClick={() => {
              console.log("delete clicked");
              setConfirmOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={confirmOpen}
        onClose={() => !isDeleting && setConfirmOpen(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Delete draft order?</h3>

          <p className="text-sm text-muted-foreground">
            "{order.title ?? "Untitled draft"}" will be permanently deleted.
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
