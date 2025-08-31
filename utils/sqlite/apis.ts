import { ConversationType } from "@/type/conversation";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ai-chat-app.db");

const postConversations = async (conversations: ConversationType[]): Promise<void> => {
  try {
    const insert = await db.prepareAsync(`INSERT INTO conversations (id, title) VALUES (?, ?)`);
    try {
      await Promise.all(conversations.map((conversation) => insert.executeAsync(conversation.id, conversation.title)));
    } finally {
      await insert.finalizeAsync();
    }
  } catch (error) {
    console.error("Error setting conversations:", error);
  }
};

const getConversations = async (): Promise<ConversationType[]> => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM conversations`);

    if (!result) return [];
    return result as ConversationType[];
  } catch (error) {
    console.error("Error getting conversations:", error);
    return [];
  }
};

const putConversation = async (conversation: ConversationType): Promise<void> => {
  try {
    const existingConversation = await db.getFirstAsync(`SELECT id FROM conversations WHERE id = ?`, conversation.id);

    if (existingConversation) {
      await db.runAsync(
        `UPDATE conversations SET title = ?, updated = datetime("now") WHERE id = ?`,
        conversation.title,
        conversation.id,
      );
    } else {
      await db.runAsync(`INSERT INTO conversations (id, title) VALUES (?, ?)`, conversation.id, conversation.title);
    }
  } catch (error) {
    console.error("Error setting conversation:", error);
  }
};

export const apis = { postConversations, getConversations, putConversation };
