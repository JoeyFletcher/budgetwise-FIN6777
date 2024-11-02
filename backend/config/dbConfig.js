// dbConfig.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../', process.env.DATABASE_URL);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Read and run the initial migration script
    const migrationPath = path.resolve(__dirname, '../migrations/initialSchema.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');
    
    db.exec(migration, (err) => {
      if (err) {
        console.error('Error running migration:', err.message);
      } else {
        console.log('Database migration completed successfully.');
      }
    });
  }
});

module.exports = db;
