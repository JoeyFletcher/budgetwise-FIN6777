// authController.js (Updated for SQLite)
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const db = require('../config/sqlite_db'); // Import SQLite connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Configure the client
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const login = async (req, res) => {
  console.log('🔹 Login request received:', req.body);
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    console.log('⚠️ Missing fields: usernameOrEmail or password');
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  try {
    // Find user by username or email
    const query = `
      SELECT user_id, username, first_name, password, email
      FROM users
      WHERE username = ? OR email = ?;
    `;
    const values = [usernameOrEmail, usernameOrEmail];

    db.get(query, values, async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }

      if (!user) {
        console.log('⚠️ User not found:', usernameOrEmail);
        return res.status(404).json({ error: 'User not found.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Password mismatch for:', usernameOrEmail);
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      console.log("session id",req.session.id)

      const twoFact = Math.floor(100000 + Math.random() * 500000);

      req.session.twofact = twoFact;
      req.session.user = { userId: user.user_id, username: user.username, first_name: user.first_name }
      console.log("session id",req.session.id, twoFact)
      
      const params = {
        Source: process.env.EMAIL, // Must be verified in SES
        Destination: {
          ToAddresses: [user.email]
        },
        Message: {
          Subject: {
            Data: 'Your Verification Code'
          },
          Body: {
            Text: {
              Data: `Your verification code is: ${twoFact}`
            },
            Html: {
              Data: `
                <html>
                  <body>
                    <h2>Verification Code</h2>
                    <p>Your verification code is: <strong>${twoFact}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                  </body>
                </html>
              `
            }
          }
        }
      };
    
      const result = await sesClient.send(new SendEmailCommand(params));
      console.log('Email sent successfully:', result.MessageId);
      return res.status(200).json({ success: true, message: 'Verification code sent to email' });

    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const twoFactorAuth = async (req, res) => {
  console.log("session id",req.session.id)
  const {twoFactorCode} = req.body;
  console.log('THIS IS THE SESSION TWO FACTOR', req.session.twofact)
  console.log( "THIS IS THE SUBMITTED CODE", twoFactorCode);

  if (String(twoFactorCode) === String(req.session.twofact)) {
    console.log('✅ User authenticated successfully');
    // Generate JWT Token
    const token = jwt.sign(
      { userId: req.session.user.userId, username: req.session.user.username, first_name: req.session.user.first_name },
      secretKey,
      { expiresIn: '1h' }
    );

    console.log('📡 Sending login response:', { success: true, token });
    res.status(200).json({ success: true, message: 'Login successful', token });
  } else {
    console.log('❌ Two-factor authentication failed');
    return res.status(401).json({ error: 'Invalid two-factor code.' });
  }
}


module.exports = { login,twoFactorAuth };
