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
    
    let letra = shot.replace(/[0-9]/g,"")
    let numero = shot.replace(/[A-Za-z.]/g, "")
    let swap;
    let pathPlayer;
    let barco = positionsGrid[letra][numero];

    player === "Player 1" ? swap = counter1 : swap = counter2
    player === "Player 1" ? pathPlayer = count1 : pathPlayer = count2
    
    
    if( barco === 0 || barco === 'X' ) {
      return 'You hit water'
    }else{

      if(swap[barco]){

        let barcoName = barco.replace(/[0-9]/g,""); 
        
        swap[barco] = ++swap[barco]
        
        if( swap[barco] === rules[barcoName] ){
          return 'You destroyed the ship'
        }
        return 'You hit a ship'
      }else{
        swap[barco] = 1 
      }
    }
    
    fs.writeFileSync(pathPlayer, JSON.stringify(swap));
    positionsGrid[letra][+numero] = 'X';
    console.log(positionsGrid);

    if(player === "Player 1"){
      fs.writeFileSync(reqPath2, JSON.stringify(positionsGrid));
    } else {
       fs.writeFileSync(reqPath1, JSON.stringify(positionsGrid));
    }


    // Ver si la cantidad de elementos del contador es = a la cantidad de barcos de las rules
      // ejemplo --> contador=15 elementos   y el total barcos de las reglas es 20
      // la grilla --> no sirve porque hay que recorrer para contar elementos / poco dinamico
    // si la cantidad es igual Y CADA barco del contador tiene la misma cantidad de posiciones que las rules de esta fn
    // el jugador gano la partida
}

module.exports = shotPositions;