"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Movimentacao } from "@/types/index";
import {
  attachmentsService,
  type TransactionAttachment,
} from "@/services/attachments/attachments.service";
import { AttachmentModalBody } from "./transaction-attachments-modal/AttachmentModalBody";
import { AttachmentModalHeader } from "./transaction-attachments-modal/AttachmentModalHeader";
import { getErrorMessage } from "./transaction-attachments-modal/attachmentErrors";

interface TransactionAttachmentsModalProps {
  transaction: Movimentacao;
  onClose: () => void;
  currentUserId: string;
  isOwner: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

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
          <AttachmentModalHeader onClose={onClose} />

          <AttachmentModalBody
            description={transaction.description || ""}
            error={error}
            success={success}
            loading={loading}
            attachment={attachment}
            isPdf={isPdf}
            downloading={downloading}
            deleting={deleting}
            uploading={uploading}
            canManageAttachment={canManageAttachment}
            fileInputRef={fileInputRef}
            onDownload={() => void handleDownload()}
            onDelete={() => void handleDelete()}
            onUpload={(event) => void handleUpload(event)}
          />
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
