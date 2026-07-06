import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");

export function resolveDbPath() {
  const configuredPath = process.env.DB_PATH ?? "./data/projectssj.sqlite";
  return path.isAbsolute(configuredPath) ? configuredPath : path.resolve(serverRoot, configuredPath);
}

export function openDatabase() {
  const dbPath = resolveDbPath();
  mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  ensureSchema(db);

  return db;
}

export function ensureSchema(db) {
  db.exec(`
    create table if not exists messages (
      id integer primary key autoincrement,
      source_file text not null,
      sent_at text not null,
      sent_date text not null,
      sent_hour integer not null,
      sender text not null,
      message text not null,
      created_at text not null default (datetime('now'))
    );

    create index if not exists idx_messages_sent_date on messages(sent_date);
    create index if not exists idx_messages_sender on messages(sender);
    create index if not exists idx_messages_source_file on messages(source_file);
  `);
}
