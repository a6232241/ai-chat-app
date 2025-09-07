import * as SQLite from "expo-sqlite";
import { migrateDbIfNeeded } from "../sqlite/init";
import GitHubModel from "./GitHubModel";
import Sqlite from "./Sqlite";

class Apis {
  private db = SQLite.openDatabaseSync("ai-chat-app.db");
  sqlite: Sqlite;

  private header: RequestInit["headers"] = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_GITHUB_AI_MODELS_ACCESS_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  githubModel: GitHubModel;

  constructor() {
    migrateDbIfNeeded(this.db);
    this.sqlite = new Sqlite(this.db);
    this.githubModel = new GitHubModel(this.header);
  }
}

export default new Apis();
