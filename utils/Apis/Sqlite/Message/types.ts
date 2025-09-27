type MessageType = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system" | "developer";
  content: string;
  created: number;
  isDeleted: number;
  status?: "error";
};
type PostMessageRequire = Omit<MessageType, "isDeleted">;
type GetMessageResponse = Omit<MessageType, "conversationId">;
type PutMessageRequire = PostMessageRequire;

export type { GetMessageResponse, MessageType, PostMessageRequire, PutMessageRequire };
