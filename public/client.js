
const audio = new Audio('./notification.wav');

const socket = io('http://localhost:8000'); 

const name = localStorage.getItem('lumora-user') || prompt("Enter your name to join");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};


socket.on('connect', () => {
  console.log("✅ Connected to socket server");
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message !== '') {
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
  }
});


socket.emit('new-user-joined', name);


socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'left');
  audio.play();
});

socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left');
  audio.play();
});

socket.on('user-left', name => {
  append(`${name} left the chat`, 'left');
});


