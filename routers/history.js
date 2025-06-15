const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const historyPath = path.join(__dirname, '../chat-history.json');

router.post('/save-history', (req, res) => {
  const newEntry = req.body;

  fs.readFile(historyPath, 'utf8', (err, data) => {
    let history = [];
    if (!err && data) {
      try {
        history = JSON.parse(data);
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }

    history.push(newEntry);

    fs.writeFile(historyPath, JSON.stringify(history, null, 2), err => {
      if (err) {
        console.error('Failed to save chat:', err);
        return res.status(500).json({ error: 'Save failed' });
      }
      res.status(200).json({ message: 'Saved successfully' });
    });
  });
});

module.exports = router;
