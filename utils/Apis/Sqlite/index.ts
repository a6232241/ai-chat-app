import * as SQLite from "expo-sqlite";
import Config from "./Config";
import Conversation from "./Conversation";
import Message from "./Message";

class Sqlite extends Config {
  message: Message;
  conversation: Conversation;

  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
    this.message = new Message(this.db);
    this.conversation = new Conversation(this.db);
  }
}

export default Sqlite;
