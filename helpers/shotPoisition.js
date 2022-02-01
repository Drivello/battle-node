function shotPositions(positionsGrid, shot){
  
  shot = shot.split(); // ["A5"]

    let ships = {
        destroyer: 4,
        //destroyer1 ++
        // patrol_boat2 ++  // si llega a 2 es que lo derribo
      }
    
    let letra = shot[0][0];
    let numero = shot[0][1];

    let barco = positionsGrid[letra][+numero]; // ej "destroyer1"

    if(barco){
      // reemplazamos ese barco por una X ?  

      !ships[barco] ? ships[barco] = 1 : ships[barco]++
      console.log(ships, ships[barco])

      console.log('acertaste a tu adversario')
    } else {
      console.log('sigue intentando')
    }
   
    return ships;
}

module.exports = shotPositions;