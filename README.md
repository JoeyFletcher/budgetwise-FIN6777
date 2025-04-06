# Budgetwise

Budgetwise is a personal finance dashboard built for FIN6777. The application combines Vue 3 + Quasar for the frontend, Node.js + Express for the backend, and SQLite for lightweight storage. It integrates directly with Plaid for real bank transaction data and Alpaca for simulated investment operations.

## Features

- Plaid integration to link bank accounts and fetch real transactions
- Manual transaction categorization with dropdown selection
- Amortization of individual transactions across multiple months
- Save transactions for budgeting with adjusted (amortized) amounts
- Full budgeting system based on amortized transaction data
- Investment Dashboard integrated with Alpaca Paper Trading API:
    - Sweep excess funds into investments
    - Portfolio Growth
    - Asset Allocation
    - Stock Performance
    - Holdings
    - Trade History
- Sidebar is collapsible, sticky, and adapts to full page height

## Prerequisites

- Node.js (>= 16.x)
- npm
- Git
- Redis (for caching and session management)

### Redis Installation

#### Windows
1. Download and install Redis for Windows from the Microsoft Store or GitHub:
   - [Microsoft Store Redis](https://apps.microsoft.com/store/detail/redis/XPFCG1MRNJVHCF)
   - Or use [Memurai](https://www.memurai.com/), a Redis-compatible solution for Windows

2. After installation, start the Redis server:
   ```
   redis-server
   ```

#### macOS
1. Using Homebrew:
   ```
   brew install redis
   ```

2. Start Redis server:
   ```
   brew services start redis
   ```
   
3. Verify Redis is running:
   ```
   redis-cli ping
   ```
   The response should be "PONG"

## Getting Started

### Clone the Repository

```
git clone https://github.com/JoeyFletcher/budgetwise-FIN6777.git
cd budgetwise-FIN6777
```

### Frontend Setup

```
cd frontend
npm install
quasar dev
```

Frontend will run at:

```
http://localhost:9000/
```

### Backend Setup

```
cd ../backend
npm install
```

Create a `.env` file inside the `/backend` directory with the following content:

```
PORT=3001
SECRET_KEY=your_secret_key_here

# SQLite Database
DATABASE_URL=./backend/budgetwise.sqlite

# Plaid API Credentials
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Alpaca Trading API
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
ALPACA_BASE_URL=https://paper-api.alpaca.markets

#AWS SES Credentials
AWS_ACCESS_KEY_ID=enter_aws_ses_access_key_id
AWS_SECRET_ACCESS_KEY=enter_aws_secret_access_key
AWS_REGION=aws_region(us-east-2)
EMAIL=enter_aws_email

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=enter_redis_password

# Rapid API
RAPIDAPI_KEY=your_rapidapi_key
```
Note: The SQLite database file is already included in the repository (`budgetwise.sqlite`), no setup required.

### Start the Backend

```
npm run dev
```

Backend will run at:

```
http://localhost:3001/
```

## Core Functionality Overview

- Transactions are fetched directly from Plaid Sandbox.
- Users can:
    - Adjust categories via dropdown
    - Amortize transactions across any number of months
    - Include/Exclude transactions from the budget
- Saved transactions include amortized amounts ready for budgeting
- Budget is automatically calculated based on included transactions
- The Investment Dashboard provides:
    - Automated Sweep Investments (default tab)
    - Portfolio analytics and tracking using Alpaca Paper Trading API

## Useful Commands

### Frontend

```
npm install
quasar dev
quasar build
```

### Backend

```
npm install
npm run dev
npm start
```

