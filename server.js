const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  console.log("🔌 A user connected");

  socket.on('new-user-joined', name => {
    console.log(`🟢 ${name} joined the chat`);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    const sender = users[socket.id];
    if (sender) {
      socket.broadcast.emit('receive', {
        message: message,
        name: sender
      });
    }
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      console.log(`🔴 ${name} left the chat`);
      socket.broadcast.emit('user-left', name);
      delete users[socket.id];
    }
  });
});

// Serve your frontend (public folder)
app.use(express.static('public'));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
