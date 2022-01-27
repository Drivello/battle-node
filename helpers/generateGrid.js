
const generateGridData = (width = 10, height = 10) => {

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
      return grid;
    }
  };

module.exports = generateGridData;
