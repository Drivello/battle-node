const axios = require("axios");
const fs = require("fs");
const path = require("path");
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require("../helpers/gridpositions");
const shotPositions = require('../helpers/shotPoisition');
const AppError = require('../Error/appError');
let serverStatus = "IDLE";
let grid;

const getPlayerApi = (req, res) => {
    res.send("hello");
};

const postChallenge = async (req, res) => {
  try{
    const io = req.app.get('socketio') 
    const resp = await axios.post('http://localhost:3002/player2/challenge', {
        msg: "lets play"
    })

    io.sockets.emit('eventsPlayer1', {
        msg: 'You send invitation to Player 2'
    });

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
    
    const io = req.app.get('socketio') 
    try {
        if(Object.keys(rulesP2).length === 3 && serverStatus === 'WAITING RULES') {
            serverStatus = 'SETTING UP'

            grid = generateGridData(rulesP2.width, rulesP2.heigth);

            io.sockets.emit('eventsPlayer1', {msg: 'Your grid has been created successfully!'})

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
      const io = req.app.get('socketio') 
      const { positions } = req.body;
      const reqPath = path.join(__dirname, '../uploads/positionP1.txt');



     serverStatus = 'RIVAL WAITING'; //eliminar
    
    if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){
        serverStatus = 'PROCESSING PLACEMENT'
      
        grid = generateGridData();

        let finalGrid = gridPositions(grid, positions);
        console.log(finalGrid)
        io.sockets.emit('eventsPlayer1', {
            msg: `You have uploaded the positions ${JSON.stringify(positions)} to your grid`
        })
        console.log('grilla final p1', finalGrid)

        const saveRulesGrid = {
            grid: finalGrid, 
            barcosTotales: positions
          };

        fs.writeFileSync(reqPath, JSON.stringify(saveRulesGrid))

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

    try {
        const io = req.app.get('socketio') 
        const { X, Y} = req.params;

        if(typeof(X) === 'undefined' || typeof(Y) === 'undefined' ){
            const {shot} = req.body
            
            // ESTE PRIMER IF ESTA BIEN
            if(shot){
                // soy atacado
                const reqPath = path.join(__dirname, '../uploads/positionP1.txt');
                let data = fs.readFileSync(reqPath, 'utf8');
                
                let response = shotPositions(JSON.parse(data), shot, "Player 1");

                io.sockets.emit('eventsPlayer1', {
                    msg: `Your opponent sent a shot to the coordinates ${shot}`
                })
                res.json(response);
            }
        }else{
            // estoy atacando
            let {data} = await axios.post(`http://localhost:3002/player2/shot/`,{
                shot: X+Y
            })
            io.sockets.emit('eventsPlayer1', {
                msg: `${data} at coordinates ${X+Y}`
            })
            res.sendStatus(200)
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const postYield = async (req, res) => {
  serverStatus = "IDLE";

  const io = req.app.get('socketio') 
  io.sockets.emit('eventsPlayer1', {
    msg: 'You surrender :( '
})

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
