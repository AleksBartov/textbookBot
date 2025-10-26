import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("./blocks.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS blocks (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'content',
    text TEXT NOT NULL,
    keyboard_type TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY,
    block_id INTEGER UNIQUE REFERENCES blocks(id),
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER,
    block_id INTEGER,
    passed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, block_id)
  );
  
  CREATE INDEX IF NOT EXISTS idx_user_progress ON user_progress(user_id, block_id);
`);

export const stmt = {
  getBlock: db.prepare("SELECT * FROM blocks WHERE id = ?"),
  getTest: db.prepare("SELECT * FROM tests WHERE block_id = ?"),
  getUserProgress: db.prepare(
    "SELECT passed FROM user_progress WHERE user_id = ? AND block_id = ?"
  ),
  markTestPassed: db.prepare(
    "INSERT OR REPLACE INTO user_progress (user_id, block_id, passed) VALUES (?, ?, TRUE)"
  ),
  getAdjacentBlocks: db.prepare(`
    SELECT 
      (SELECT id FROM blocks WHERE id < ? ORDER BY id DESC LIMIT 1) as prev,
      (SELECT id FROM blocks WHERE id > ? ORDER BY id LIMIT 1) as next
  `),
  getMaxBlockId: db.prepare("SELECT MAX(id) as maxId FROM blocks"),
  updateBlockKeyboard: db.prepare(
    "UPDATE blocks SET keyboard_type = 'middle' WHERE id = ?"
  ),
  insertBlock: db.prepare(
    "INSERT INTO blocks (id, type, text, keyboard_type) VALUES (?, ?, ?, ?)"
  ),
  insertTest: db.prepare(
    "INSERT INTO tests (block_id, question, correct_answer, options) VALUES (?, ?, ?, ?)"
  ),
  updateBlockText: db.prepare("UPDATE blocks SET text = ? WHERE id = ?"),
  checkBlockExists: db.prepare("SELECT id FROM blocks WHERE id = ?"),
  getAllBlocks: db.prepare(`
    SELECT b.*, t.question 
    FROM blocks b 
    LEFT JOIN tests t ON b.id = t.block_id 
    ORDER BY b.id
  `),
};
