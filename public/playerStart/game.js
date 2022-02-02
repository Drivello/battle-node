
// const socket = io();
var socket = io.connect('http://localhost:3001/');

socket.on('welcome', data => {
    console.log(data);
})
