export type MessageStatus = "sent" | "delivered" | "read";

export type DemoAudio = {
  url: string;
  duration: number;
  wave: number[];
};

export type DemoMessage = {
  id: number;
  mine: boolean;
  time: string;
  text?: string;
  messageType?: "text" | "audio";
  audio?: DemoAudio;
  status?: MessageStatus;
  buttons?: string[];
};

export type DemoConversation = {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  isBot?: boolean;
  hue?: number;
};
