// const db = require('../config/dbConfig');
//
// exports.getTransactionsByUserId = (req, res) => {
//   const { userId } = req.params;
//
//   const query = `SELECT * FROM transactions WHERE user_id = ?`;
//   db.all(query, [userId], (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: 'Internal server error.' });
//     } else if (rows.length === 0) {
//       res.status(404).json({ message: 'No transactions found for this user.' });
//     } else {
//       res.status(200).json(rows);
//     }
//   });
// };

const pool = require('../config/postgres_db'); // Import the PostgreSQL connection

// Function to fetch transactions for a specific user ID
const getTransactions = async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = `
      SELECT * FROM client_transactions
      WHERE account_id = (
        SELECT bank_account FROM users WHERE user_id = $1
      );
    `;
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
};

// Export the getTransactions function
module.exports = {
  getTransactions
};
