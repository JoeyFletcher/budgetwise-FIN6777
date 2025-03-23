require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import Middleware
const authenticate = require("./middleware/authMiddleware");

// Import General Routes
const authRoutes = require("./routes/authRoutes");
const signupRoutes = require("./routes/signupRoutes");
const userRoutes = require("./routes/userRoutes");
const alpacaRoutes = require("./routes/alpacaRoutes");

// 🏦 Import Plaid Routes (New Structure)
const plaidAuthRoutes = require("./routes/plaid/plaidAuth");
const plaidAccountsRoutes = require("./routes/plaid/plaidAccounts");
const plaidTransactionsRoutes = require("./routes/plaid/plaidTransactions");
const plaidWebhooksRoutes = require("./routes/plaid/plaidWebhooks");

// 🏦 Import Main Plaid Routes (⚠️ This was missing!)
const plaidRoutes = require("./routes/plaidRoutes"); // ✅ Correct path

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:9000", optionsSuccessStatus: 200 }));

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
