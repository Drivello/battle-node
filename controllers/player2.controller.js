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
    const io = req.app.get('socketio') 
    io.sockets.emit('welcome', 'acepto jugar');

    try{
      console.log('status inicial', serverStatus)
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
    const io = req.app.get('socketio') 
    try{
        const resp = await axios.post('http://localhost:3001/player1/rules', {
           rules
        })

        if(resp.data.status === 'SUCCESS'){
            serverStatus = 'SETTING UP';
            //TODO: grilla
             grid = generateGridData(rules.width, rules.height);
        
            io.sockets.emit('welcome', {
              msg: `Has enviado las reglas ${JSON.stringify(rules)} a tu oponente`
            });

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
    const io = req.app.get('socketio') 

    try {
        let { positions } = req.body;
        
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
            io.sockets.emit('welcome', {
              msg: `Has subido las siguientes posiciones ${JSON.stringify(positions)} a tu grilla`
          })

            fs.writeFileSync(reqPath, JSON.stringify(grid1));
            serverStatus = 'PROCESSING SHIP PLACEMENT';
            

            res.status(200).send('OK')

        } else{
            throw new Error('Server is not on the mood')
        }
    } catch (error) {
        console.log('error /init p2', error.message)
        res.status(404).send(error)
    }
  };

  const postShot = async (req, res) => {

    try {
      const io = req.app.get('socketio') 

      const { X, Y} = req.params;
      if(typeof(X) === 'undefined' || typeof(Y) === 'undefined' ){
        console.log('player 2 analizando posiciones')

          const {shot} = req.body
          if(shot){
              // soy atacado
              const reqPath = path.join(__dirname, '../uploads/positionP2.txt');
              const data = fs.readFileSync(reqPath, 'utf8');
              const response = shotPositions(JSON.parse(data), shot, "Player 2");

              io.sockets.emit('welcome', {
                msg: `You got shot at the coordinates ${shot}`
            })
              res.json(response)
          }
      }else{
          // estoy atacando
          console.log('player 2 atacando')
          const {data} = await axios.post(`http://localhost:3001/player1/shot/`,{
              shot: X+Y
          })
          console.log('RESPUESTA Q RECIBO DEL P1', data)
          io.sockets.emit('welcome', {
            msg: data
        })
          res.sendStatus(200)
      }
      
  } catch (error) {
      console.log(error.message)
  }

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
  