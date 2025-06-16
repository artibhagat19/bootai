



const http = require('http');
const app = require('./main');
const express = require("express");
const path = require("path");



const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});
