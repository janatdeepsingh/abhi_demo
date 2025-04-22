const io = require('socket.io')(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  console.log("🔌 A user connected");

  // New user joins
  socket.on('new-user-joined', name => {
    console.log(`🟢 ${name} joined the chat`);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  // Message is sent
  socket.on('send', message => {
    const sender = users[socket.id];
    if (sender) {
      socket.broadcast.emit('receive', {
        message: message,
        name: sender
      });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      console.log(`🔴 ${name} left the chat`);
      socket.broadcast.emit('user-left', name);
      delete users[socket.id];
    }
  });
});



