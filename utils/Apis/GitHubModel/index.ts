import type { PostMessageToChatBody, PostMessageToChatResponse } from "./types";

class GitHubModel {
  header: RequestInit["headers"];

  constructor(header: RequestInit["headers"]) {
    this.header = header;
  }

  async postMessageToChat(data: PostMessageToChatBody): Promise<PostMessageToChatResponse> {
    const response = await fetch("https://models.github.ai/inference/chat/completions", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify({
        model: "openai/gpt-4.1",
        messages: [data],
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  }
}

export default GitHubModel;
