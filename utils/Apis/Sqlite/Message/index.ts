import Config from "../Config";
import { formatterDate } from "./helper";
import type { GetMessageResponse, PostMessageRequire, PutMessageRequire } from "./types";

class Message extends Config {
  async postMessage(message: PostMessageRequire): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO messages (id, conversation_id, role, content, created, status) VALUES (?, ?, ?, ?, ?, ?)`,
        message.id,
        message.conversationId,
        message.role,
        message.content,
        formatterDate(message.created),
        message.status ?? null,
      );
    } catch (error) {
      console.error("Error posting message:", error);
    }
  }

  async postMessages(messages: PostMessageRequire[]): Promise<void> {
    try {
      const insert = await this.db.prepareAsync(
        `INSERT INTO messages (id, conversation_id, role, content, created, status) VALUES (?, ?, ?, ?, ?, ?)`,
      );
      try {
        await Promise.all(
          messages.map((message) =>
            insert.executeAsync(
              message.id,
              message.conversationId,
              message.role,
              message.content,
              formatterDate(message.created),
              message.status ?? null,
            ),
          ),
        );
      } finally {
        await insert.finalizeAsync();
      }
    } catch (error) {
      console.error("Error posting messages:", error);
    }
  }

  async getMessages(conversationId: string): Promise<GetMessageResponse[]> {
    try {
      const result = await this.db.getAllAsync(
        `SELECT id, role, content, created, is_deleted as isDeleted, status FROM messages WHERE conversation_id = ? ORDER BY created DESC`,
        conversationId,
      );
      if (!result) return [];
      return result as GetMessageResponse[];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  async deleteMessages(messageId: string): Promise<void> {
    try {
      await this.db.runAsync(`UPDATE messages SET is_deleted = 1, deleted = CURRENT_TIMESTAMP WHERE id = ?`, messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  async putMessage(message: PutMessageRequire): Promise<void> {
    try {
      const existingMessage = await this.db.getFirstAsync(`SELECT id FROM messages WHERE id = ?`, message.id);

      if (existingMessage) {
        await this.db.runAsync(
          `UPDATE messages SET conversation_id = ?, role = ?, content = ?, created = ?, status = ? WHERE id = ?`,
          message.conversationId,
          message.role,
          message.content,
          formatterDate(message.created),
          message.status ?? null,
          message.id,
        );
      } else {
        await this.postMessage(message);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  }
}

export default Message;
