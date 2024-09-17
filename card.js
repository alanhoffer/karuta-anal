const { cropImage, processImage } = require('./utils/imageManager');
const regions = [
  { left: 84, top: 367, width: 200, height: 20 },
  { left: 350, top: 367, width: 200, height: 20 },
  { left: 633, top: 367, width: 200, height: 20 }
];

const getSmallestNumber = async (imagePath) => {
  const results = [];
  
  for (let i = 0; i < regions.length; i++) {
    const croppedImagePath = await cropImage(imagePath, regions[i], i + 1);
    
    if (croppedImagePath) {
      const result = await processImage(croppedImagePath, i + 1);
      if (result !== null) {
        results.push(result);
      }
    }
  }
  
  console.log(`Numeros encontrados:`, results);
  if (results.length > 0) {
    results.sort((a, b) => a.number - b.number);
    const smallest = results[0];
    return smallest.index;
  } else {
    console.log("No se encontraron números válidos.");
    return null;
  }
};

module.exports = { getSmallestNumber };
