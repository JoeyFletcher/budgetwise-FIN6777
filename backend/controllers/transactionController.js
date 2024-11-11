const pool = require('../config/postgres_db'); // Import the PostgreSQL connection

// Function to fetch transactions for a specific account ID
const getTransactions = async (req, res) => {
  const accountId = req.params.accountId;

  try {
    const query = `
      SELECT * FROM client_transactions
      WHERE account_id = $1;
    `;
    const { rows } = await pool.query(query, [accountId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this account.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
};

// Function to fetch transaction summary for a specific account ID
const getTransactionSummary = async (req, res) => {
  const accountId = req.params.accountId;
  const { startDate, endDate } = req.query;

  try {
    const query = `
      SELECT db_cr, SUM(amount) AS total_amount
      FROM client_transactions
      WHERE transaction_date BETWEEN $1 AND $2
      AND account_id = $3
      GROUP BY db_cr;
    `;
    const { rows } = await pool.query(query, [startDate, endDate, accountId]);

    let totalIncome = 0;
    let totalExpenses = 0;

    rows.forEach(row => {
      if (row.db_cr.toLowerCase() === 'credit') {
        totalIncome += parseFloat(row.total_amount);
      } else if (row.db_cr.toLowerCase() === 'debit') {
        totalExpenses += parseFloat(row.total_amount);
      }
    });

    const netBalance = totalIncome - totalExpenses;

    res.status(200).json({ totalIncome, totalExpenses, netBalance });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Server error while fetching transaction summary' });
  }
};

// Function to fetch spending by category for a specific account ID with both date range and year/month filter support
const getSpendingByCategory = async (req, res) => {
  const accountId = req.params.accountId;
  const { startDate, endDate, year, month } = req.query;

  try {
    let query;
    let params;

    if (year && month) {
      // If year and month are provided, fetch spending for that month
      query = `
        SELECT bb.expense_type, SUM(ct.amount) AS total_amount
        FROM client_transactions ct
        JOIN mcc_codes mc ON ct.mcc_code = mc.mcc
        JOIN budget_buckets bb ON mc.budget_bucket_code = bb.budget_bucket_code
        WHERE TO_CHAR(ct.transaction_date, 'YYYY') = $1
        AND TO_CHAR(ct.transaction_date, 'MM') = $2
        AND ct.account_id = $3
        GROUP BY bb.expense_type;
      `;
      params = [year, month, accountId];
    } else if (startDate && endDate) {
      // If date range is provided, fetch spending for that range
      query = `
        SELECT bb.expense_type, SUM(ct.amount) AS total_amount
        FROM client_transactions ct
        JOIN mcc_codes mc ON ct.mcc_code = mc.mcc
        JOIN budget_buckets bb ON mc.budget_bucket_code = bb.budget_bucket_code
        WHERE ct.transaction_date BETWEEN $1 AND $2
        AND ct.account_id = $3
        GROUP BY bb.expense_type;
      `;
      params = [startDate, endDate, accountId];
    } else {
      return res.status(400).json({ error: 'Either startDate/endDate or year/month must be provided.' });
    }

    const { rows } = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this account.' });
    }

    const categorySpending = {};
    rows.forEach(row => {
      categorySpending[row.expense_type] = parseFloat(row.total_amount);
    });

    res.status(200).json({ categorySpending });
  } catch (error) {
    console.error('Error fetching spending by category:', error);
    res.status(500).json({ error: 'Server error while fetching spending by category' });
  }
};

// Export the updated functions
module.exports = {
  getTransactions,
  getTransactionSummary,
  getSpendingByCategory,
};
