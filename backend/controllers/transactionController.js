// transactionController.js
const pool = require('../config/postgres_db'); // Import the PostgreSQL connection

// Function to fetch transactions for a specific bank account
const getTransactions = async (req, res) => {
  const bankAccount = req.params.bankAccount;

  try {
    const query = `
      SELECT * FROM client_transactions
      WHERE bank_account = $1;
    `;
    const { rows } = await pool.query(query, [bankAccount]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this account.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
};

// Function to fetch transaction summary for a specific bank account
const getTransactionSummary = async (req, res) => {
  const bankAccount = req.params.bankAccount;
  const { startDate, endDate } = req.query;

  try {
    console.log(`Fetching transaction summary for account: ${bankAccount}, from ${startDate} to ${endDate}`);

    const query = `
      SELECT 
        SUM(CASE WHEN LOWER(TRIM(db_cr)) = 'deposit' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN LOWER(TRIM(db_cr)) = 'withdrawal' THEN amount ELSE 0 END) AS total_expenses
      FROM client_transactions
      WHERE transaction_date BETWEEN $1 AND $2
      AND bank_account = $3;
    `;
    const { rows } = await pool.query(query, [startDate, endDate, bankAccount]);

    console.log('Query result:', rows);

    if (rows.length > 0) {
      const { total_income = 0, total_expenses = 0 } = rows[0];
      const netBalance = total_income - total_expenses;

      console.log(`Total Income: ${total_income}, Total Expenses: ${total_expenses}, Net Balance: ${netBalance}`);

      res.status(200).json({ totalIncome: total_income, totalExpenses: total_expenses, netBalance });
    } else {
      res.status(404).json({ message: 'No transactions found for this account.' });
    }
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Server error while fetching transaction summary' });
  }
};

// Function to fetch spending by category for a specific bank account with both date range and year/month filter support
const getSpendingByCategory = async (req, res) => {
  const bankAccount = req.params.bankAccount;
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
        AND ct.bank_account = $3
        GROUP BY bb.expense_type;
      `;
      params = [year, month, bankAccount];
    } else if (startDate && endDate) {
      // If date range is provided, fetch spending for that range
      query = `
        SELECT bb.expense_type, SUM(ct.amount) AS total_amount
        FROM client_transactions ct
        JOIN mcc_codes mc ON ct.mcc_code = mc.mcc
        JOIN budget_buckets bb ON mc.budget_bucket_code = bb.budget_bucket_code
        WHERE ct.transaction_date BETWEEN $1 AND $2
        AND ct.bank_account = $3
        GROUP BY bb.expense_type;
      `;
      params = [startDate, endDate, bankAccount];
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
