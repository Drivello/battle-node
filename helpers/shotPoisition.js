function shotRival(positionsGrid, shot, ships){

    let ships = {
        destroyer: 6
        // todos los barcos con cant de pos
      }
    
    let msg;

    for(let i in positionsGrid){
        let letra = shot[0][0];
        let number = shot[0][1];

        if(letra === i){
          //console.log(positionsGrid[i])
          const existe = positionsGrid[i].find(el => el === shot)
          
          if(existe) {
              // restar posicion a barco determinado
              ships.destroyer-1
              // reemplazar en la grilla por un 0?

              // settear el msj
              msg = 'Great, you hit your shot'
          } else {
            msg = 'You failed your shot'
          }
        }
      }

      return ships;
}

