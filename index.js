const express = require('express');
const cors = require('cors');
const Http = require('http');
const homeSocket = require('./sockets/home.js');
const socketIO = require('socket.io');
const path = require('path');
const gameSocket = require('./sockets/game.js');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static('/views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/game/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'game.html'));
});

const server = Http.createServer(app);
const io = socketIO(server);
homeSocket(io);
gameSocket(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log('runnning');
});
