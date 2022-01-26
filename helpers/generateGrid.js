
const generateGridData = (width = 10, height = 10, initialValue = 0) => {
    width = +width;
    height = +height;

    const gridArray = [];

    for (let i = 0; i < height; i++) {
      gridArray.push(new Array(width).fill(initialValue));
    }
  
    return gridArray;
  };

module.exports = generateGridData;