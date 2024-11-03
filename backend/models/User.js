// User.js

const db = require('../config/dbConfig');

class User {
  static createUser(username, email, firstName, lastName, passwordHash, callback) {
    const query = `
      INSERT INTO users (username, email, first_name, last_name, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [username, email, firstName, lastName, passwordHash], callback);
  }
  static findUserByUsernameOrEmail(usernameOrEmail, callback) {
    const query = `
      SELECT * FROM users WHERE username = ? OR email = ?
    `;
    db.get(query, [usernameOrEmail, usernameOrEmail], (err, user) => {
      if (err) {
        console.error('Database query error:', err); // Log the actual error to identify issues
      }
      callback(err, user);
    });
  }
}

module.exports = User;
