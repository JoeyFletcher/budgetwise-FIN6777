const db = require('../config/sqlite_db'); // Ensure the correct SQLite connection

class User {
  /**
   * Create a new user in the database
   */
  static createUser(username, email, firstName, lastName, passwordHash, callback) {
    const query = `
      INSERT INTO users (username, email, first_name, last_name, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [username, email, firstName, lastName, passwordHash], function (err) {
      if (err) {
        console.error("❌ Error inserting user:", err.message);
        callback(err, null);
      } else {
        console.log(`✅ User created with ID ${this.lastID}`);
        callback(null, this.lastID);
      }
    });
  }

  /**
   * Find a user by username or email
   */
  static findUserByUsernameOrEmail(usernameOrEmail, callback) {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;

    db.get(query, [usernameOrEmail, usernameOrEmail], (err, user) => {
      if (err) {
        console.error("❌ Database query error:", err.message);
      }
      callback(err, user);
    });
  }
}

module.exports = User;
