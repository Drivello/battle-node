const { config } = require("dotenv");
config();
const axios = require("axios")
const express = require('express');
const path = require('path');
const socketio1 = require('socket.io');
const socketio2 = require('socket.io');
const AppError = require("./Error/appError");
const globalErrorHandler = require('./controllers/errorController');
const player1routes = require('./routes/player1');
const player2routes = require('./routes/player2');

// Set app
let app1 = express();   //(player API)
let app2 = express();   //(rival API)


// Set Ports
app1.set('port', process.env.PORT1 || 3001)
app2.set('port', process.env.PORT2 || 3002)

// static files
app1.use(express.static(path.join(__dirname, 'public/playerStart')));
app2.use(express.static(path.join(__dirname, 'public/rivalPlayer')));


// Middlewares
app1.use(express.json());
app2.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app2.use(express.urlencoded({ extended: false }));



// Instances
const server1 = app1.listen(app1.get('port'), () => { console.log(`Started server1 on PORT ${app1.get('port')}`); }); 
const server2 = app2.listen(app2.get('port'), () => { console.log(`Started server2 on PORT ${app2.get('port')}`); });

// Routes
app1.use('/player1', player1routes)
app2.use('/player2', player2routes)

// Error Handler
app1.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app2.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app1.use(globalErrorHandler);
app2.use(globalErrorHandler);

// Socket connection
const io1 = socketio1(server1);
const io2 = socketio2(server2);

app1.set('socketP1', io1);
app1.set('socketP2', io2);
app2.set('socketP1', io1);
app2.set('socketP2', io2);

io1.on('connection', async (socket) => {
    await axios.get("http://localhost:3001/player1")
    await axios.get("http://localhost:3002/player2")
})

io2.on('connection', async (socket) => {
    await axios.get("http://localhost:3001/player1")
    await axios.get("http://localhost:3002/player2")
})

module.exports = {
    app1,
    app2,
    io1,
    io2
}
