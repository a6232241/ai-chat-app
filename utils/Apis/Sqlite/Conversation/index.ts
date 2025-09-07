import Config from "../Config";
import type { GetConversationResponse, PostConversationRequire, PutConversationRequire } from "./types";

class Conversation extends Config {
  async postConversations(conversations: PostConversationRequire[]): Promise<void> {
    try {
      const insert = await this.db.prepareAsync(`INSERT INTO conversations (id, title) VALUES (?, ?)`);
      try {
        await Promise.all(
          conversations.map((conversation) => insert.executeAsync(conversation.id, conversation.title)),
        );
      } finally {
        await insert.finalizeAsync();
      }
    } catch (error) {
      console.error("Error setting conversations:", error);
    }
  }

  async getConversations(searchText?: string): Promise<GetConversationResponse[]> {
    try {
      const result = searchText
        ? await this.db.getAllAsync(
            `SELECT * FROM conversations WHERE title LIKE ? ORDER BY updated DESC`,
            `%${searchText}%`,
          )
        : await this.db.getAllAsync(`SELECT * FROM conversations ORDER BY updated DESC`);

      if (!result) return [];
      return result as GetConversationResponse[];
    } catch (error) {
      console.error("Error getting conversations:", error);
      return [];
    }
  }

  async putConversation(conversation: PutConversationRequire): Promise<void> {
    try {
      const existingConversation = await this.db.getFirstAsync(
        `SELECT id FROM conversations WHERE id = ?`,
        conversation.id,
      );

      if (existingConversation) {
        await this.db.runAsync(
          `UPDATE conversations SET title = ?, updated = datetime("now") WHERE id = ?`,
          conversation.title,
          conversation.id,
        );
      } else {
        await this.db.runAsync(
          `INSERT INTO conversations (id, title) VALUES (?, ?)`,
          conversation.id,
          conversation.title,
        );
      }
    } catch (error) {
      console.error("Error setting conversation:", error);
    }
  }
}

export default Conversation;
