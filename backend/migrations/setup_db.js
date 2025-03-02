const db = require('../config/sqlite_db');

db.serialize(() => {
  console.log('🔧 Setting up SQLite database...');

  // Create Users Table (Without Bank Info)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    password TEXT NOT NULL,  -- Store hashed passwords
    created_at TEXT DEFAULT (DATETIME('now')),
    updated_at TEXT DEFAULT (DATETIME('now'))
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err.message);
    } else {
      console.log('✅ Users table created successfully!');
    }
  });

  db.close();
});
