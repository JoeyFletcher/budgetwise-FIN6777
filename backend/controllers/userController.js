const db = require('../config/sqlite_db'); // Import SQLite connection

const getUserDashboard = (req, res) => {
    const userId = req.user.userId;

    // Fetch user data from SQLite
    const query = `SELECT username, first_name FROM users WHERE user_id = ?`;

    db.get(query, [userId], (err, user) => {
        if (err) {
            console.error('❌ Error fetching user dashboard data:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        if (!user) {
            console.warn('⚠️ User not found for ID:', userId);
            return res.status(404).json({ error: 'User not found.' });
        }

        // Example balance (since we're no longer tracking balances in the DB)
        const userData = {
            username: user.username,
            first_name: user.first_name,
            balance: 0 // Replace with actual logic if needed
        };

        console.log('✅ User dashboard data fetched:', userData);
        res.status(200).json(userData);
    });
};

module.exports = { getUserDashboard };
