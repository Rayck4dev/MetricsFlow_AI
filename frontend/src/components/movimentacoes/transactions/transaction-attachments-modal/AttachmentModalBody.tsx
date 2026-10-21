"use client";

import type { RefObject } from "react";
import {
  Download,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react";
import type { TransactionAttachment } from "@/services/attachments/attachments.service";

interface AttachmentModalBodyProps {
  description: string;
  error: string;
  success: string;
  loading: boolean;
  attachment: TransactionAttachment | null;
  isPdf: boolean;
  downloading: boolean;
  deleting: boolean;
  uploading: boolean;
  canManageAttachment: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDownload: () => void;
  onDelete: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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

export function AttachmentModalBody({
  description,
  error,
  success,
  loading,
  attachment,
  isPdf,
  downloading,
  deleting,
  uploading,
  canManageAttachment,
  fileInputRef,
  onDownload,
  onDelete,
  onUpload,
}: AttachmentModalBodyProps) {
  return (
    <div className="space-y-4 p-5">
      <div className="rounded-xl border border-surface-border p-4">
        <p className="text-xs text-muted-foreground">
          Movimentação selecionada
        </p>
        <p className="mt-1 font-medium">
          {description || "Movimentação sem descrição"}
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
              onClick={onDownload}
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
                onClick={onDelete}
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
          <p className="mt-3 text-sm font-medium">Nenhum comprovante anexado</p>
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
            onChange={onUpload}
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
  );
}
