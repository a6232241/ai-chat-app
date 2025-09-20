import * as SQLite from "expo-sqlite";
import { migrateDbIfNeeded } from "../sqlite/init";
import GitHubModel from "./GitHubModel";
import Sqlite from "./Sqlite";

class Apis {
  private db: SQLite.SQLiteDatabase | null = null;
  sqlite: Sqlite | null = null;

  private header: RequestInit["headers"] = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_GITHUB_AI_MODELS_ACCESS_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  githubModel: GitHubModel;

  constructor() {
    this.githubModel = new GitHubModel(this.header);
  }

  async init() {
    this.db = await SQLite.openDatabaseAsync("ai-chat-app.db");
    const result = await migrateDbIfNeeded(this.db);

    this.sqlite = new Sqlite(this.db);
    return result;
  }
}

export default new Apis();
