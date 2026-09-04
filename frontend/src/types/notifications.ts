export type NotificationType =
  | "transaction_created"
  | "transaction_updated"
  | "transaction_deleted"
  | "financial_summary"
  | "whatsapp";

export interface Notification {
  id: string;
  user_id: string;
  company_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
