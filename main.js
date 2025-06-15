const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const historyRoutes = require('./routers/history'); // optional

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static assets in root (like index.html, JS, CSS)
app.use(express.static(__dirname));

// Load decision tree
const decisionTreePath = path.join(__dirname, 'bot-logic', 'decision-tree.json');
let decisionTree = {};
try {
  const rawData = fs.readFileSync(decisionTreePath, 'utf-8');
  decisionTree = JSON.parse(rawData);
} catch (err) {
  console.error('❌ Error loading decision tree:', err.message);
}

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const node = req.body.node;
  const response = decisionTree[node] || {
    message: "❓ Sorry, I don't understand.",
    options: []
  };
  res.json(response);
});

// Save history endpoint
app.post('/api/save-history', (req, res) => {
  const historyPath = path.join(__dirname, 'chat-history.json');
  const newEntry = req.body;

  let history = [];
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf-8') || '[]');
  }
  history.push(newEntry);

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  res.json({ status: 'ok' });
});

// Optional custom routes
app.use('/api', historyRoutes);

// Serve index.html directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
