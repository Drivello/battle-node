const fs = require('fs');
const path = require('path');

const reqPath1 = path.join(__dirname, '../uploads/positionP1.txt');
const reqPath2 = path.join(__dirname, '../uploads/positionP2.txt');

const count1 = path.join(__dirname, '../uploads/count1.txt');
const count2 = path.join(__dirname, '../uploads/count2.txt');

function shotPositions(positionsGrid, shot, player, rules = {
  patrol_boat: 2,
  submarine: 3,
  destroyer: 4,
  carrier: 5,
  }){
    
    // leemos contador
    let counter1 = JSON.parse(fs.readFileSync(count1, 'utf8'))
    let counter2 = JSON.parse(fs.readFileSync(count2, 'utf8'));
    
    console.log(counter1);
    
    // Modificamos el contador
    let letra = shot.replace(/[0-9]/g,"")
    let numero = shot.replace(/[A-Za-z.]/g, "")
    let alternativa;
    let pathPlayer;
    let barco = positionsGrid[letra][numero];

    player === "Player 1" ? alternativa = counter1 : alternativa = counter2
    player === "Player 1" ? pathPlayer = count1 : pathPlayer = count2
    
    
    console.log("barco :", barco)
    if( barco === 0 || barco === 'X' ) {
      console.log('Fallaste malo')
    }else{

      if(alternativa[barco]){

        let barcoName = barco.replace(/[0-9]/g,""); 
        
        alternativa[barco] = ++alternativa[barco]
        
        if( alternativa[barco] === rules[barcoName] ){
          console.log('Destruiste el Barco')
        }
        console.log('Le pegaste bro')
      }else{
        alternativa[barco] = 1 
      }
    }
    
    console.log("counter1: ",counter1)
    console.log("alternativa: ", alternativa)
    fs.writeFileSync(pathPlayer, JSON.stringify(alternativa));
    positionsGrid[letra][+numero] = 'X';
    console.log(positionsGrid);

    if(player === "Player 1"){
      fs.writeFileSync(reqPath2, JSON.stringify(positionsGrid));
    } else {
       fs.writeFileSync(reqPath1, JSON.stringify(positionsGrid));
    }


}

module.exports = shotPositions;