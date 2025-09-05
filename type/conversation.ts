import { MessageType } from "@/apis";

export type MessageWithTimestampType = MessageType & {
  created: number;
};

export type ConversationType = { id: string; title: string };
