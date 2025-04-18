require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session')
const cookieParser = require('cookie-parser')
const {RedisStore} = require("connect-redis")
const {createClient} = require ("redis")

// Import Middleware
const authenticate = require("./middleware/authMiddleware");

// Import General Routes
const authRoutes = require("./routes/authRoutes");
const signupRoutes = require("./routes/signupRoutes");
const userRoutes = require("./routes/userRoutes");
const alpacaRoutes = require("./routes/alpacaRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

// 🏦 Import Plaid Routes (New Structure)
const plaidAuthRoutes = require("./routes/plaid/plaidAuth");
const plaidAccountsRoutes = require("./routes/plaid/plaidAccounts");
const plaidTransactionsRoutes = require("./routes/plaid/plaidTransactions");
const plaidWebhooksRoutes = require("./routes/plaid/plaidWebhooks");

// 🏦 Import Main Plaid Routes
const plaidRoutes = require("./routes/plaidRoutes");

// Import Rapid API Routes
const rapidRoutes = require('./routes/rapidRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || ''
});
redisClient.connect().catch(console.error)

// Middleware setup
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "budgetSession:",
})
app.use(cookieParser())
app.use(session({
  secret: 'something secure',
  resave: false,
  saveUninitialized: true,
  store: redisStore,
  cookie: {
    secure: false,
    maxAge: 600000
  },
  name: 'sessionId'
}));
app.use(bodyParser.json());
app.use(cors({ 
  origin: 'http://localhost:9000',
  credentials: true,
}));

// ✅ Debugging: Log registered routes
console.log("🔗 Registering General Routes...");
console.log(" - /api/auth");
console.log(" - /api/signup");
console.log(" - /api/user");
console.log(" - /api/alpaca");

// ✅ Register General Routes
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/alpaca", alpacaRoutes);
app.use("/api/budget", budgetRoutes);
app.use('/api/rapid', rapidRoutes);

// ✅ Debugging: Log Plaid Routes
console.log("🏦 Registering Plaid Routes...");
console.log(" - /api/plaid/auth");
console.log(" - /api/plaid/accounts");
console.log(" - /api/plaid/transactions");
console.log(" - /api/plaid/webhooks");
console.log(" - /api/plaid/link/token"); // ✅ Added logging
console.log(" - /api/plaid/exchange/public_token"); // ✅ Added logging

// ✅ Register Plaid Routes (Ensuring all are accessible)
app.use("/api/plaid/auth", plaidAuthRoutes);
app.use("/api/plaid/accounts", plaidAccountsRoutes);
app.use("/api/plaid/transactions", plaidTransactionsRoutes);
app.use("/api/plaid/webhooks", plaidWebhooksRoutes);
app.use("/api/plaid", plaidRoutes); // ✅ Ensures `link/token` and `exchange/public_token` exist

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
