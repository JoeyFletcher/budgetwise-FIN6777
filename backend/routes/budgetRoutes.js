const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_DIR = "./data";
const BUDGET_FILE = `${DATA_DIR}/saved_budgets.json`;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure budget file exists
if (!fs.existsSync(BUDGET_FILE)) {
  fs.writeFileSync(BUDGET_FILE, JSON.stringify({ budgets: {} }, null, 2));
}

// Get saved budgets
router.get("/", (req, res) => {
  try {
    const budgets = JSON.parse(fs.readFileSync(BUDGET_FILE));
    res.json({ budgets: budgets });
  } catch (error) {
    console.error("❌ Error fetching budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// Save budget data
router.post("/save", (req, res) => {
  try {
    const budgets = req.body;
    fs.writeFileSync(BUDGET_FILE, JSON.stringify(budgets, null, 2));
    res.json({ success: true, message: "Budget saved successfully" });
  } catch (error) {
    console.error("❌ Error saving budget:", error);
    res.status(500).json({ error: "Failed to save budget" });
  }
});

module.exports = router;