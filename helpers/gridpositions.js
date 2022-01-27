
const gridPositions = (grid, ship) => {
if (ship[0][0] === ship[1][0]){
    let distance = (Number(ship[1][1] - Number(ship[0][1])))
    for (let i = 0; i <= distance ; i++) {
        let letra = ship[0][0]
        let index = Number(ship[0][1])-1 + i
        grid[letra][index] = letra+(index+1)
        
    }
  } else{
    let letterUnicode = ship[0][0].charCodeAt(0)  // to number  B --> 66
    console.log(letterUnicode)
    let distance = ( ship[1][0].charCodeAt(0) - ship[0][0].charCodeAt(0));
  
    for (let i = 0; i <= distance ; i++) {
      let letra = String.fromCharCode(letterUnicode + i);
      let index = Number(ship[0][1])
      grid[letra][index] = letra+(index);
        }
    }
}

module.exports = gridPositions;