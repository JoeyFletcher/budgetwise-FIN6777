const sqlite3 = require('sqlite3').verbose();
const db = require('../config/sqlite_db'); // SQLite connection

// ✅ Ensure transactions table exists
db.run(`CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    category TEXT,
    transaction_date TEXT DEFAULT CURRENT_TIMESTAMP
);`, (err) => {
    if (err) {
        console.error("❌ Error creating transactions table:", err.message);
    } else {
        console.log("✅ Transactions table is ready.");
    }
});

// ✅ Function to insert transactions into SQLite
const insertTransaction = (user_id, amount, transaction_type, description, category, transaction_date, callback) => {
    const query = `INSERT INTO transactions (user_id, amount, transaction_type, description, category, transaction_date) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [user_id, amount, transaction_type, description, category, transaction_date], function (err) {
        if (err) {
            console.error("❌ Error inserting transaction:", err.message);
            callback(err, null);
        } else {
            console.log(`✅ Transaction added with ID ${this.lastID}`);
            callback(null, this.lastID);
        }
    });
};

// ✅ Function to fetch transactions for a user
const getTransactionsByUser = (user_id, callback) => {
    const query = `SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC`;
    
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error("❌ Error fetching transactions:", err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

module.exports = { insertTransaction, getTransactionsByUser };
