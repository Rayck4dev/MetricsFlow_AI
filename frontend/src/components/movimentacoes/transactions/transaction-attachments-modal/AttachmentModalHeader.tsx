import { Paperclip, X } from "lucide-react";

export function AttachmentModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-surface-border p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-surface-border p-2.5">
          <Paperclip size={19} />
        </div>
        <div>
          <h2 id="attachments-modal-title" className="text-base font-semibold">
            Comprovante da movimentação
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anexe ou consulte o documento desta movimentação.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar modal"
        className="rounded-lg p-2 transition hover:bg-white/5"
      >
        <X size={18} />
      </button>
    </header>
  );
}
