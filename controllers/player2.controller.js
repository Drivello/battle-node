const axios = require('axios');
const fs = require('fs');
const path = require('path');
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require('../helpers/gridpositions');
const shotPositions = require('../helpers/shotPoisition');
var serverStatus = 'IDLE';
var grid;
var grid1 = {};

const getRivalApi = (req, res) => {
    res.send('hello player 2')
  };
  
  const postChallenge = async (req, res) => {
    try{
        if(req.body.msg === 'lets play' && serverStatus === 'IDLE'){
            serverStatus = 'THINKING RULES'
            res.status(200).json({
                status: 'SUCCESS',
            })
        }else{
            throw new Error('Server not prepared or msg incorrect')
        }
   } catch(error){
       console.log(error)
   }
  };
  
  const postRules = async (req, res) => {
    const { rules } = req.body;

    try{
        const resp = await axios.post('http://localhost:3001/player1/rules', {
           rules
        })

        if(resp.data.status === 'SUCCESS'){
            serverStatus = 'SETTING UP';
            //TODO: grilla
             grid = generateGridData(rules.width, rules.height);
            console.log('grilla p2', grid)
            res.status(200).send('OK')
        }
        else{
            throw new Error('Failed to deliver the rules')
        }

    
    } catch(error){
        console.log('error /rules p2', error.message)
        res.status(404)
    }
  };
  
  const postReady = async (req, res) => {
    console.log('grid en ready', grid) //TODO: que llegue el grid de la ruta anterior para usar dentro del for

    try {
        let { positions } = req.body;
        //console.log('POSICIONES', positions)
        
        const reqPath = path.join(__dirname, '../uploads/positionP2.txt');

        let serverStatus = 'RIVAL WAITING'; // eliminar

        if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){

              grid1 = generateGridData();

            // for(let pos in positions){
            //     //console.log('cada posicion en el for', positions[pos])
            //      gridPositions(grid1, positions[pos], positions.ships);
            // } 
            // console.log('grilla + posiciones P2', grid1);
            gridPositions(grid1, positions);

            fs.writeFileSync(reqPath, JSON.stringify(grid1));
            serverStatus = 'PROCESSING SHIP PLACEMENT';
            
            // TODO: no funciona este axios
            await axios.post('http://localhost:3001/player1/shot/:X/:Y', {
                msg: 'finished placement'
            })

            res.status(200).send('OK')

        } else{
            throw new Error('Server is not on the mood')
        }
    } catch (error) {
        console.log('error /init p2', error.message)
        res.status(404).send(error)
    }
  };

  // router.post('/ready', async(req, res) => {

//     try{
//         const {message} = req.body;
//         if(message === 'ready'){
//             serverStatus = 'SENDING SHOT'
//             res.status(200).json({
//                 status: 'SENDING SHOT',
//             })
//         }
//         res.status(200).send('OK');
//     } catch(error){
//         console.log(error)
//     }
    
// })

  
  const postShot = async (req, res) => {
    const shot = req.body.shot;
    console.log('Posiciones recibidas del Player API:', shot)

    const reqPath = path.join(__dirname, '../uploads/positionP2.txt');
    const data = fs.readFileSync(reqPath, 'utf8');
    //console.log('DATA del PLAYER 2', JSON.parse(data));

    shotPositions(JSON.parse(data), shot, "Plaasda");

    res.send('holii')
  };
  
  const postYield = async (req, res) => {
    serverStatus = 'IDLE';
    res.send('Finish game')
    
  };
  
  module.exports = {
    getRivalApi,
    postChallenge,
    postRules,
    postReady,
    postShot,
    postYield,
  };
  