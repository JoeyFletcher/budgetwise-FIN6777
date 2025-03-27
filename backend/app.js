require('dotenv').config();
const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const {RedisStore} = require("connect-redis")
const {createClient} = require ("redis")

const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const signupRoutes = require('./routes/signupRoutes');
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes'); // ✅ Transactions now handled via Plaid API
const alpacaRoutes = require('./routes/alpacaRoutes'); // ✅ Alpaca trading API


const authenticate = require('./middleware/authMiddleware'); // Import the auth middleware

const app = express();
const PORT = process.env.PORT || 3001;

let redisConnect = createClient()
redisConnect.connect().catch(console.error)

// Middleware setup
let redisStore = new RedisStore({
  client: redisConnect,
  prefix: "budgetSession:",
})
app.use(cookieParser())
app.use(session({
  secret: 'something secure',
  resave: false,
  saveUninitialized: true,
  store:redisStore,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:9000', optionsSuccessStatus: 200 }));  // CORS setup for development

// Routes
app.use('/api/auth', authRoutes);    
app.use('/api/signup', signupRoutes);  
app.use('/api/user', authenticate, userRoutes);  
app.use('/api/plaid', plaidRoutes);  // ✅ Transactions via Plaid API
app.use('/api/alpaca', alpacaRoutes);  

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
