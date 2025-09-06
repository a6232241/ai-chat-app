type MessageType = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  created: number;
  isDeleted: number;
};
type PostMessageRequire = Omit<MessageType, "isDeleted">;
type GetMessageResponse = Omit<MessageType, "conversationId">;

export type { GetMessageResponse, MessageType, PostMessageRequire };
