const DEFAULT_HEADERS = {
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.EXPO_PUBLIC_GITHUB_AI_MODELS_ACCESS_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export type MessageType = {
  role: "user" | "assistant";
  content: string;
};

type PostMessageToChatBody = MessageType;

type PostMessageToChatResponse = {
  choices: {
    message: MessageType;
  }[];
  created: number;
};

export async function postMessageToChat(data: PostMessageToChatBody): Promise<PostMessageToChatResponse> {
  const response = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      model: "openai/gpt-4.1",
      messages: [data],
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const responseData = await response.json();
  console.log("apis.ts:34", responseData);
  return responseData;
}
