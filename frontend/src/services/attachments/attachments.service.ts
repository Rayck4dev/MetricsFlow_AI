import { apiClient } from "@/services/api/api-client";

export interface TransactionAttachment {
  id: string;
  transaction_id: string;
  file_name: string;
  content_type: "application/pdf" | "image/jpeg" | "image/png";
  size_bytes: number;
  uploaded_by_user_id: string;
  created_at: string;
}

interface UploadAttachmentResponse {
  message: string;
  attachment: TransactionAttachment;
}

interface DownloadAttachmentResponse {
  url: string;
  expires_in: number;
  file_name: string;
}

interface MessageResponse {
  message: string;
}

export const attachmentsService = {
  async findByTransaction(
    transactionId: string,
  ): Promise<TransactionAttachment | null> {
    try {
      return await apiClient.get<TransactionAttachment>(
        `/transactions/${transactionId}/attachments`,
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  async upload(
    transactionId: string,
    file: File,
  ): Promise<TransactionAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.postFormData<UploadAttachmentResponse>(
      `/transactions/${transactionId}/attachments`,
      formData,
    );

    return response.attachment;
  },

  async getDownloadUrl(
    attachmentId: string,
  ): Promise<DownloadAttachmentResponse> {
    return apiClient.get<DownloadAttachmentResponse>(
      `/attachments/${attachmentId}/download`,
    );
  },

  async delete(attachmentId: string): Promise<void> {
    await apiClient.delete<MessageResponse>(`/attachments/${attachmentId}`);
  },
};
