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
    

    try{
        if(req.body.msg === 'lets play' && serverStatus === 'IDLE'){
            serverStatus = 'THINKING RULES';

            io.sockets.emit('eventsRivalPlayer', 'I accept challenge!');

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
        
            io.sockets.emit('eventsRivalPlayer', {
              msg: `You sent the rules ${JSON.stringify(rules)} to your oponent`
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
    console.log('grid en ready', grid);
    
    try {
      const io = req.app.get('socketio');
      let { positions } = req.body;
        
        const reqPath = path.join(__dirname, '../uploads/positionP2.txt');

        let serverStatus = 'RIVAL WAITING'; // eliminar

        if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){

            grid1 = generateGridData();
            gridPositions(grid1, positions);
            io.sockets.emit('eventsRivalPlayer', {
              msg: `You have uploaded the positions ${JSON.stringify(positions)} to your grid`
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

          const {shot} = req.body
          if(shot){
              // soy atacado
              const reqPath = path.join(__dirname, '../uploads/positionP2.txt');
              const data = fs.readFileSync(reqPath, 'utf8');
              const response = shotPositions(JSON.parse(data), shot, "Player 2");

              io.sockets.emit('eventsRivalPlayer', {
                msg: `Your opponent sent a shot to the coordinates ${shot}`
            })
              res.json(response)
          }
      }else{
          // estoy atacando
          const {data} = await axios.post(`http://localhost:3001/player1/shot/`,{
              shot: X+Y
          })
          io.sockets.emit('eventsRivalPlayer', {
            msg: `${data} at coordinates ${X+Y}`
        })
          res.sendStatus(200)
      }
      
  } catch (error) {
      console.log(error.message)
  }

  };
  
  const postYield = async (req, res) => {
    serverStatus = 'IDLE';

    const io = req.app.get('socketio') 
    io.sockets.emit('eventsRivalPlayer', {
      msg: 'You surrender :( '
  })

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
  