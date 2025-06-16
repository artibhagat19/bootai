const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const historyRoutes = require('./routers/history'); // optional

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use(express.static(__dirname));


const decisionTreePath = path.join(__dirname, 'bot-logic', 'decision-tree.json');
let decisionTree = {};
try {
  const rawData = fs.readFileSync(decisionTreePath, 'utf-8');
  decisionTree = JSON.parse(rawData);
} catch (err) {
  console.error('❌ Error loading decision tree:', err.message);
}


app.post('/api/chat', (req, res) => {
  const node = req.body.node;
  const response = decisionTree[node] || {
    message: "❓ Sorry, I don't understand.",
    options: []
  };
  res.json(response);
});


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


app.use('/api', historyRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
