
const generateGridData = (width = 10, height = 10, ship) => {

  var grid = {}
  for (let i = 0; i < height; i++) {
    if (i < 26) {
        grid[String.fromCharCode(65 + i)] = new Array(width).fill(0);
    } else {
        let acc = Math.floor(i / 26)
        let primerLetra = String.fromCharCode(64 + acc) 
        let segundaLetra = String.fromCharCode(65 + i - acc * 26)
        grid[primerLetra + segundaLetra] = new Array(width).fill(0);
    }
}

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
  };

module.exports = generateGridData;
