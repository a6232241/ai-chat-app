type MessageType = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  created: number;
};
type PostMessageRequire = MessageType;
type GetMessageResponse = Omit<MessageType, "conversationId">;

export type { GetMessageResponse, MessageType, PostMessageRequire };
