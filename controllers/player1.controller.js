const axios = require("axios");
const fs = require("fs");
const path = require("path");
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require("../helpers/gridpositions");
const shotPositions = require('../helpers/shotPoisition');
let serverStatus = "IDLE";
let grid;

const getPlayerApi = (req, res) => {
    res.send("hello");
};

const postChallenge = async (req, res) => {
  try{
    
    const resp = await axios.post('http://localhost:3002/player2/challenge', {
        msg: "lets play"
    })

    io.sockets.emit('welcome', 'hi player 1');

    if(resp.data.status === "SUCCESS"){
        serverStatus = 'WAITING RULES'
        res.status(200).send('OK')
    } 
    
} catch(error){
    console.log(error)
}
};

const postRules = async (req, res) => {
  let rulesP2 = req.body.rules
    serverStatus = 'WAITING RULES'
    // console.log('reglas p2', rulesP2)
    
    const io = req.app.get('socketio') 
    try {
        if(Object.keys(rulesP2).length === 3 && serverStatus === 'WAITING RULES') {
            serverStatus = 'SETTING UP'

            grid = generateGridData(rulesP2.width, rulesP2.heigth);
            console.log('grilla p1', grid)

            io.sockets.emit('welcome', {msg: 'Has creado exitosamente tu grilla'})


            res.status(200).json({
                status: 'SUCCESS',
            })
        }
        else{
            throw new Error('Rules incomplete')
        }
    } catch (error) {
        console.log('error /rules p1', error.message)
        res.status(404).send(error)
    }
};

const postInit = async (req, res) => {
  try {
    const { positions } = req.body;
    console.log('positions p1', positions)
    const reqPath = path.join(__dirname, '../uploads/positionP1.txt');

    const io = req.app.get('socketio') 


     serverStatus = 'RIVAL WAITING'; //eliminar
    
    if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){
        serverStatus = 'PROCESSING PLACEMENT'
      
        grid = generateGridData();

        let finalGrid = gridPositions(grid, positions);
        io.sockets.emit('welcome', {
            msg: `Has subido las siguientes posiciones ${JSON.stringify(positions)} a tu grilla`
        })
        console.log('grilla final p1', finalGrid)

        // console.log('grilla + posiciones PLAYER1', grid)
        fs.writeFileSync(reqPath, JSON.stringify(grid))

        serverStatus = 'WAITING RIVAL'
        res.status(200).send('OK')
    } else{
        throw new Error('Server is not on the mood')
    }
} catch (error) {
    console.log('error /init p1', error.message)
    res.status(404).send(error)
}
};

const postShot = async (req, res) => {
    // ------ Si yo golpeo ---------- Los params son verdaderos y validos
    // saco las coordenadas de los params 
    // hago un llamado al rival con las coordenadas enviadas por body y el rival cambia su estado a preparing for shot
    // cambio mi estado a waiting for shot 
    // recibo la respuesta y la muestro
    // ------ Si me golpean --------- El body es verdadero y valido
    // recibo las coordenadas por body
    // calculo si fui golpeado o no 
    // cambio mi estado a preparing shot
    // respondo si golpeo o no

    try {
        const io = req.app.get('socketio') 
        const { X, Y} = req.params;

        if(typeof(X) === 'undefined' || typeof(Y) === 'undefined' ){
            const {shot} = req.body
            console.log('shot p1', shot);
            console.log('param p1', req.params)
            if(shot){
                // soy atacado
                const reqPath = path.join(__dirname, '../uploads/positionP1.txt');
                const data = fs.readFileSync(reqPath, 'utf8');
                const response = shotPositions(JSON.parse(data), shot, "Player 1");

                io.sockets.emit('welcome', {
                    msg: `You got shot at the coordinates ${shot}`
                })
                res.json(response);
            }
        }else{
            // estoy atacando
            const {data} = await axios.post(`http://localhost:3002/player2/shot/`,{
                shot: X+Y
            })
            io.sockets.emit('welcome', {
                msg: data
            })
            res.sendStatus(200)
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const postYield = async (req, res) => {
  serverStatus = "IDLE";
  res.send('Finish game')
};

module.exports = {
  getPlayerApi,
  postChallenge,
  postRules,
  postInit,
  postShot,
  postYield,
};
