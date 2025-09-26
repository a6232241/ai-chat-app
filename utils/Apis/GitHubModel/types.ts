type PostMessageToChatBody = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
};

type PostMessageToChatResponse = {
  choices: {
    message: PostMessageToChatBody;
  }[];
  created: number;
  id: string;
};

export type { PostMessageToChatBody, PostMessageToChatResponse };
