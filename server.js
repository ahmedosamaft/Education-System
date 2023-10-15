const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const server = http.createServer(app);
require('dotenv').config({ path: 'config.env' });

const port = process.env.PORT || '6000';

server
  .listen(port, () => console.log(`Server is listening on port ${port} 🟢`))
  .on('error', (err) => console.log('Failed to run server! 💥', err.message));

const URL = process.env.DB_URL.replace(
  /<password>/i,
  encodeURIComponent(process.env.PASSWORD)
);

mongoose.connect(URL).then(
  (_) => console.log('DB Connected Successfully! 🟢'),
  (_) => console.log('DB Failed to connect!💥')
);
