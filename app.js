const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const player1routes = require('./routes/player1');
const player2routes = require('./routes/player2');


// Set app
let app1 = express();   //(player API)
let app2 = express();   //(rival API)

// Port
// app1.set('port',6000)
// app2.set('port', 4000)

// Middlewares
app1.use(express.json());
app2.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app2.use(express.urlencoded({ extended: false }));

//Rutas
app1.use('/player1', player1routes)
app2.use('/player2', player2routes)


// Socket connection
//const io = socketio(app)

module.exports = {
    app1,
    app2
}
