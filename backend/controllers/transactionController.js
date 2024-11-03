const db = require('../config/dbConfig');

exports.getTransactionsByUserId = (req, res) => {
  const { userId } = req.params;

  const query = `SELECT * FROM transactions WHERE user_id = ?`;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error.' });
    } else if (rows.length === 0) {
      res.status(404).json({ message: 'No transactions found for this user.' });
    } else {
      res.status(200).json(rows);
    }
  });
};
