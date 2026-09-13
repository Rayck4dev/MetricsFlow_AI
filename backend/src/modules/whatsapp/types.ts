export type IncomingWhatsAppMessage = {
  providerMessageId: string;
  phoneNumber: string;
  type: 'text' | 'audio';
  text?: string;
  mediaId?: string;
  payload: unknown;
};
