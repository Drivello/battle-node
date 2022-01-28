const axios = require("axios");
const fs = require("fs");
const path = require("path");
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require("../helpers/gridpositions");
let serverStatus = "IDLE";
let grid;


const getPlayerApi = (req, res) => {
  console.log("conexion a player1");
  res.send("hello");
};

const postChallenge = async (req, res) => {
  try{
    const resp = await axios.post('http://localhost:3002/player2/challenge', {
        msg: "lets play"
    })
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
    console.log('reglas p2', rulesP2)
    //console.log('status P1', serverStatus)
    try {
        if(Object.keys(rulesP2).length === 3 && serverStatus === 'WAITING RULES') {
            serverStatus = 'SETTING UP'

            grid = generateGridData(rulesP2.width, rulesP2.heigth);
            console.log('grilla p1', grid)
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
    const reqPath = path.join(__dirname, '../uploads/positionP1.txt');

     serverStatus = 'RIVAL WAITING'; //eliminar
    
    if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){
        serverStatus = 'PROCESSING PLACEMENT'
        fs.writeFileSync(reqPath, JSON.stringify(positions))
        //TODO: subir a la grilla las posiciones por cada uno de los elementos del array
        for(let pos in positions){
            gridPositions(grid, positions[pos]);
        } 
        console.log('grilla + posiciones P1', grid)
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

// //TODO: este ready es necesario?
// const ready = async(req, res) => {

//     try {

//         const resp = await axios.post('http://localhost:3002/player2/ready', {message: "ready"})
//         if(resp.serverStatus=== 'SENDING SHOT') {
//             serverStatus = 'WAITING SHOT'
//         }

//         res.status(200).send('OK')
//     } catch (error) {
//         console.log('error /ready p1', error.message)
//     }
//   }
//

const postShot = async (req, res) => {
  const { X, Y} = req.params;
  const positionShot = X+Y;


  try {
      //
      // const reqPath = path.join(__dirname, '../uploads/positionP2.txt');
      // const data = fs.readFileSync(reqPath, 'utf8');
      // console.log(JSON.parse(data));

      //TODO: enviar las coordenadas positionShot al Rival
      await axios.post("http://localhost:3002/player2/shot/:X/:Y", {
          shot: positionShot
      })

      res.status(200).send('Send shot');

  } catch(error){
      console.log(error);
  }
};

const postYield = async (req, res) => {
  serverStatus = "IDLE";
};

module.exports = {
  getPlayerApi,
  postChallenge,
  postRules,
  postInit,
  postShot,
  postYield,
};
