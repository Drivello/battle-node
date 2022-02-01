function shotPositions(positionsGrid, shot, rules = {
  patrol_boat: 2,
  submarine: 3,
  destroyer: 4,
  carrier: 5,
  }){
  // recibir reglas de cantidad de espacios que ocupa cada barco
  // cambiar en la grilla por una X si encuentra el barco + guardar grilla
  // tener un contador
  // retornar mensajes correspondientes: acerto, no acerto, acerto y se hundio el barco
  
  shot = shot.split(); // ["A5"]

  // Contador
    let ships = {
        destroyer1: 4,  // le acerto 4 veces a ese mismo barco
      }
    
    let letra = shot[0][0];
    let numero = shot[0][1];

    let barco = positionsGrid[letra][+numero]; // ej "destroyer1"

    if(barco !== 0 && barco !== 'X'){
      positionsGrid[letra][+numero] = 'X';
      
      !ships[barco] ? ships[barco] = 1 : ships[barco]++
      console.log(ships)

      console.log('acertaste a tu adversario')
      console.log(positionsGrid);

    } else {
      console.log('sigue intentando')
    }
   
    return ships;
}

module.exports = shotPositions;