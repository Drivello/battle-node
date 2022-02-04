const fs = require('fs');
const path = require('path');

const reqPath1 = path.join(__dirname, '../uploads/positionP1.txt');
const reqPath2 = path.join(__dirname, '../uploads/positionP2.txt');
const reqPathRules = path.join(__dirname, '../uploads/rules.txt');
const reqPathIdx = path.join(__dirname, '../uploads/index.txt');



const count1 = path.join(__dirname, '../uploads/count1.txt');
const count2 = path.join(__dirname, '../uploads/count2.txt');

function shotPositions( positionsGrid, shot, player, rules = {
  patrol_boat: 2,
  submarine: 3,
  destroyer: 4,
  carrier: 5,
  }){ 
    // leemos contado

    let countTotalShips = 0;

    for( prop in positionsGrid.barcosTotales){
      console.log('cantidad de barcos for', positionsGrid.barcosTotales[prop].length)
      countTotalShips += positionsGrid.barcosTotales[prop].length
    }

    let counter1 = JSON.parse(fs.readFileSync(count1, 'utf8'))
    let counter2 = JSON.parse(fs.readFileSync(count2, 'utf8'));

    let letra = shot.replace(/[0-9]/g,"")
    let numero = shot.replace(/[A-Za-z.]/g, "")
    let swap;
    let pathPlayer;
    console.log("positionsGrid.grid: ", positionsGrid.grid, "letra:",letra, "numero: ",numero)
    let barco = positionsGrid.grid[letra][numero];
    
    console.log('barco bsuqueda en grilla', positionsGrid.grid)
    let readIdx = JSON.parse(fs.readFileSync( reqPathIdx , 'utf8'));

    console.log("letra: ", letra, "numero: ", numero)

    player === "Player 1" ? swap = counter1 : swap = counter2
    player === "Player 1" ? pathPlayer = count1 : pathPlayer = count2
    player === 'Player 1' ? idxSwap = 'player1' : idxSwap =  'rivalplayer'
    
    console.log('antes del if')
    if( barco === 0 || barco === 'X' ) {
      return 'You hit water'
    }else{

      if(swap[barco]){
        console.log('positionsGrid.grid if', positionsGrid.grid)
        let barcoName = barco.replace(/[0-9]/g,""); 
        
        swap[barco] = ++swap[barco];
        
        positionsGrid.grid[letra][+numero] = 'X';
        if(player === "Player 1"){
          fs.writeFileSync(reqPath1, JSON.stringify(positionsGrid));
        } else {
           fs.writeFileSync(reqPath2, JSON.stringify(positionsGrid));
        }
        
        if( swap[barco] === rules[barcoName] ){
        console.log('positionsGrid.grid segundo if', positionsGrid.grid)

          console.log('readIdx[idxSwap] : ', readIdx[idxSwap])
          !readIdx[idxSwap] ? readIdx[idxSwap] = 1 : ++readIdx[idxSwap]  // IF

          console.log('Sumando index: ', readIdx[idxSwap] )

          fs.writeFileSync(reqPathIdx, JSON.stringify(readIdx));
          
          console.log('readIdx: ', readIdx, 'countTotalShips: ', countTotalShips)
          if(readIdx[idxSwap] === countTotalShips) return `${player} wins`
          
          return 'You destroyed one ship'
        }
        positionsGrid.grid[letra][+numero] = 'X';
        if(player === "Player 1"){
          fs.writeFileSync(reqPath1, JSON.stringify(positionsGrid));
        } else {
           fs.writeFileSync(reqPath2, JSON.stringify(positionsGrid));
        }

        fs.writeFileSync(pathPlayer, JSON.stringify(swap));
        return 'You hit a ship first if'
      }else{
        swap[barco] = 1
        positionsGrid.grid[letra][+numero] = 'X';
        if(player === "Player 1"){
          fs.writeFileSync(reqPath1, JSON.stringify(positionsGrid));
        } else {
           fs.writeFileSync(reqPath2, JSON.stringify(positionsGrid));
        }

        fs.writeFileSync(pathPlayer, JSON.stringify(swap));
        return 'You hit a ship else'
      }
    }
    
}

module.exports = shotPositions;