export type NotificationType =
  | "transaction_created"
  | "transaction_updated"
  | "transaction_deleted"
  | "financial_summary"
  | "whatsapp";

export interface Notification {
  id: string;
  user_id: string;
  actor_user_id: string | null;
  company_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  dismissed: boolean;
  created_at: string;
}
