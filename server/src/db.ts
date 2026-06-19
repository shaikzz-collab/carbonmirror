import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../carbon_mirror.db');
const db = new sqlite3.Database(dbPath);

export const initDb = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Enable foreign keys
      db.run("PRAGMA foreign_keys = ON;");

      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          streak INTEGER DEFAULT 1,
          badges_json TEXT,
          chat_history_json TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Lifestyle Answers table
      db.run(`
        CREATE TABLE IF NOT EXISTS lifestyle_answers (
          user_id INTEGER PRIMARY KEY,
          commute_style TEXT,
          commute_distance INTEGER,
          diet_style TEXT,
          local_food INTEGER,
          electricity_bill REAL,
          green_energy INTEGER,
          ac_usage TEXT,
          online_purchases TEXT,
          delivery_frequency TEXT,
          digital_usage TEXT,
          waste_generation TEXT,
          yearly_flights TEXT,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Receipt Items table
      db.run(`
        CREATE TABLE IF NOT EXISTS receipt_items (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          carbon REAL NOT NULL,
          cost REAL NOT NULL,
          date TEXT NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Completed Actions table
      db.run(`
        CREATE TABLE IF NOT EXISTS completed_actions (
          user_id INTEGER NOT NULL,
          action_id TEXT NOT NULL,
          PRIMARY KEY(user_id, action_id),
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Challenges table
      db.run(`
        CREATE TABLE IF NOT EXISTS challenges (
          user_id INTEGER NOT NULL,
          challenge_id TEXT NOT NULL,
          is_completed INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY(user_id, challenge_id),
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const get = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
};

export const all = <T>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};
