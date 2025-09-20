import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<{ success: boolean }> {
  try {
    const DATABASE_VERSION = 2;
    let currentDbVersion =
      (await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version"))?.user_version ?? null;

    if (currentDbVersion === null || currentDbVersion >= DATABASE_VERSION) {
      return { success: true };
    }

    if (currentDbVersion === 0) {
      await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created TEXT DEFAULT CURRENT_TIMESTAMP,
        updated TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      );
    `);

      currentDbVersion = 1;
    }

    if (currentDbVersion === 1) {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages_new (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        deleted TEXT DEFAULT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      );

      
      INSERT INTO messages_new (id, conversation_id, role, content, created, is_deleted)
      SELECT id, conversation_id, role, content, created, 0 FROM messages;

      DROP TABLE messages;

      ALTER TABLE messages_new RENAME TO messages;
    `);

      currentDbVersion = 2;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  } catch (error) {
    console.error("Error during database migration:", error);
    return { success: false };
  }
  return { success: true };
}
