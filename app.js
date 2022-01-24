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

//Rutas
app1.use('/api', player1routes)
app2.use('/api', player2routes)


// Middlewares
app1.use(express.json());
app2.use(express.json());

// Socket connection
//const io = socketio(app)

module.exports = {
    app1,
    app2
}
