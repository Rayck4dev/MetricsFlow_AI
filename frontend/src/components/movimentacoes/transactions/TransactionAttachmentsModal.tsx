"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Paperclip,
  Upload,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  X,
  LoaderCircle,
  FileCheck2,
} from "lucide-react";

import type { Movimentacao } from "@/types/index";
import {
  attachmentsService,
  type TransactionAttachment,
} from "@/services/attachments/attachments.service";
import { ApiError } from "@/services/api/api-client";

interface TransactionAttachmentsModalProps {
  transaction: Movimentacao;
  onClose: () => void;
  currentUserId: string;
  isOwner: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Sua sessão expirou. Entre novamente.";
    if (error.status === 403)
      return "Você não tem permissão para realizar esta ação.";
    if (error.status === 413) return "O arquivo ultrapassa o limite permitido.";
    if (error.status === 415)
      return "Formato não permitido. Envie PDF, JPG ou PNG.";
  }

  if (error instanceof Error) return error.message;
  return "Não foi possível concluir a operação.";
}

export function TransactionAttachmentsModal({
  transaction,
  onClose,
  currentUserId,
  isOwner,
}: TransactionAttachmentsModalProps) {
  const [attachment, setAttachment] = useState<TransactionAttachment | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManageAttachment =
    isOwner || attachment?.uploaded_by_user_id === currentUserId;

  async function loadAttachment() {
    setLoading(true);
    setError("");

    try {
      const result = await attachmentsService.findByTransaction(transaction.id);
      setAttachment(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAttachment();
  }, [transaction.id]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");
    setSuccess("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Formato inválido. Selecione um arquivo PDF, JPG ou PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("O arquivo deve ter no máximo 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const result = await attachmentsService.upload(transaction.id, file);
      setAttachment(result);
      setSuccess(
        attachment
          ? "Comprovante substituído com sucesso."
          : "Comprovante enviado com sucesso.",
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload() {
    if (!attachment) return;

    setError("");
    setDownloading(true);

    try {
      const result = await attachmentsService.getDownloadUrl(attachment.id);
      const link = document.createElement("a");
      link.href = result.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = result.file_name || attachment.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    if (!attachment) return;

    const confirmed = window.confirm(
      `Deseja excluir o comprovante "${attachment.file_name}"?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      await attachmentsService.delete(attachment.id);
      setAttachment(null);
      setSuccess("Comprovante excluído com sucesso.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const isPdf = attachment?.content_type === "application/pdf";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="attachments-modal-title"
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-2xl"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <header className="flex items-start justify-between gap-4 border-b border-surface-border p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-surface-border p-2.5">
                <Paperclip size={19} />
              </div>

              <div>
                <h2
                  id="attachments-modal-title"
                  className="text-base font-semibold"
                >
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

          <div className="space-y-4 p-5">
            <div className="rounded-xl border border-surface-border p-4">
              <p className="text-xs text-muted-foreground">
                Movimentação selecionada
              </p>
              <p className="mt-1 font-medium">
                {transaction.description || "Movimentação sem descrição"}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                {success}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <LoaderCircle size={18} className="animate-spin" />
                Consultando comprovante...
              </div>
            ) : attachment ? (
              <div className="rounded-xl border border-surface-border p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-surface-border p-2.5">
                    {isPdf ? <FileText size={22} /> : <ImageIcon size={22} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium">
                      {attachment.file_name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatFileSize(attachment.size_bytes)}
                      {" · "}
                      {formatDate(attachment.created_at)}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                      <FileCheck2 size={14} />
                      Comprovante anexado
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleDownload()}
                    disabled={downloading || deleting}
                    className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm transition hover:bg-white/5 disabled:opacity-50"
                  >
                    {downloading ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <Download size={15} />
                    )}
                    Baixar / visualizar
                  </button>

                  {canManageAttachment && (
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      disabled={deleting || uploading}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deleting ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-surface-border p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-surface-border">
                  <Paperclip size={22} />
                </div>
                <p className="mt-3 text-sm font-medium">
                  Nenhum comprovante anexado
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Envie um PDF, JPG ou PNG de até 5 MB.
                </p>
              </div>
            )}

            {!loading && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) => void handleUpload(event)}
                  className="hidden"
                  disabled={uploading || deleting || downloading}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || deleting || downloading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Upload size={17} />
                  )}
                  {uploading
                    ? "Enviando comprovante..."
                    : attachment
                      ? "Substituir comprovante"
                      : "Anexar comprovante"}
                </button>

                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Formatos aceitos: PDF, JPG e PNG · Máximo de 5 MB
                </p>
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
