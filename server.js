



const http = require('http');
const app = require('./main');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});
