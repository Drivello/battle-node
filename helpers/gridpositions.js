
const gridPositions = (grid, ships, rules = {
  patrol_boat: 1,
  submarine: 1,
  destroyer: 2,
  carrier: 1,
  }) => {
    const checkSize = (key,distance) => {
      distance = distance < 0 ? distance * -1 : distance
      console.log(key,distance);
      
      if(key==='patrol_boat' && distance!==1){
        throw new Error('patrol_boat de tamanio invalido')
      }
      if(key==='submarine' && distance!==2){
        throw new Error('submarine de tamanio invalido')
      }
      if(key==='destroyer' && distance!==3){
        throw new Error('destroyer de tamanio invalido')
      }
      if(key==='carrier' && distance!==4){
        throw new Error('carrier de tamanio invalido')
      }
    }

  console.log('ships p2', ships)

// Enviado por postman
//   "positions": {
//     "destroyer":[["B5", "B8"],["A1","D1"]],
//     "patrol_boat":[["D3","D4"]],
//     "submarine": [["C3","C5"]] ,
//     "carrier": [["F1","F5"]]
// }

// trabajar con una variable ships que contiene lo enviado por postman y una rules que contiene los maximos permitidos por las reglas



try {

  console.log("barcos recibidos",ships)

  let cantPatrolBoat= ships.patrol_boat[0][0] &&  ships.patrol_boat.length
  // console.log(cantPatrolBoat,rules.patrol_boat)
  let cantSubmarine= ships.submarine[0][0] &&  ships.submarine.length
  // console.log(cantPatrolBoat,rules.patrol_boat)
  let cantDestroyer= ships.destroyer[0][0] &&  ships.destroyer.length
  // console.log(cantPatrolBoat,rules.patrol_boat)
  let cantCarrier= ships.carrier[0][0] &&  ships.carrier.length

  // console.log('Patrol boat', cantPatrolBoat, ships.patrol_boat.length)
  // console.log(cantSubmarine,rules.submarine)
  // console.log('detroyer', cantDestroyer,rules.destroyer)
  



  if(!(cantPatrolBoat === rules.patrol_boat && cantSubmarine === rules.submarine && cantDestroyer === rules.destroyer && cantCarrier === rules.carrier)) {
    throw new Error ('Error on number of boats. Please check the rules.')
  }

  for (const key in ships) {
    if (Object.hasOwnProperty.call(ships, key)) {
      const element = ships[key];
      
      for (let indexArrayShips = 0; indexArrayShips < element.length; indexArrayShips++) {
        const coordenadas = element[indexArrayShips];
        console.log('coordenadas',coordenadas)
        //Anotar en la grilla => coordenadas = ["B5", "B8"]
        let vertical = coordenadas[0][0] !== coordenadas[1][0]
        if(vertical){
          let letterUnicode = coordenadas[0][0].charCodeAt(0)  // to number  B --> 66
          console.log(letterUnicode)
          let distance = ( coordenadas[1][0].charCodeAt(0) - coordenadas[0][0].charCodeAt(0));
          checkSize(key,distance)
          for (let i = 0; i <= distance ; i++) {
            let letra = String.fromCharCode(letterUnicode + i);
            //A
            let index = Number(coordenadas[0][1])
            //1
            if(grid[letra][index-1] !== 0){
              throw new Error('Ship collision')
            }
            grid[letra][index-1] = key+(indexArrayShips+1)
          }
        }else{
          let distance = (Number(coordenadas[1][1] - Number(coordenadas[0][1])))
          checkSize(key,distance)
          for (let i = 0; i <= distance ; i++) {
              let letra = coordenadas[0][0]
              let index = Number(coordenadas[0][1])-1 + i
              if(grid[letra][index] !== 0){
                throw new Error('Ship collision')
              }
              grid[letra][index] = key+(indexArrayShips+1)
          }
        }
      }      
    }
  }
  console.log(grid)
  return grid



} catch (error) {
  console.log(error.message)
}

}


module.exports = gridPositions;