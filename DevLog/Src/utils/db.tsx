import * as SQLite from "expo-sqlite";

// open the database synchronously
const db = SQLite.openDatabaseSync("devlog.db");

export const createTables = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      priority TEXT,
      startDate TEXT,
      remindOnDays TEXT,
      status TEXT
    );
  `).then(() => console.log("✅ Table created"))
    .catch((err) => console.error("❌ Table create error:", err));
};

export const addLog = async (
  title: string,
  description: string,
  priority: string,
  startDate: string,
  remindOnDays: string,
  status: string
) => {
  try {
    await db.runAsync(
      `INSERT INTO logs (title, description, priority, startDate, remindOnDays, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, priority, startDate, remindOnDays, status]
    );
    console.log("✅ Log inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting log:", error);
  }
};
