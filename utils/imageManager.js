const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const path = require('path');

const cropImage = async (inputPath, region, index, userIndex) => {
  const outputImagePath = path.join(__dirname, `../assets/${userIndex}_card_${index}.jpg`);
  try {
    await sharp(inputPath)
      .extract(region)
      .threshold(20)
      .resize(800, 200)
      .toFormat('jpeg', { quality: 100 })
      .toFile(outputImagePath);
    console.log(`Imagen recortada y guardada en: ${outputImagePath}`);
    return outputImagePath;
  } catch (error) {
    console.error(`Error al recortar y guardar la imagen ${index}:`, error);
    return null;
  }
};

const processImage = async (imagePath, index) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      tessedit_char_whitelist: '0123456789'
    });

    console.log(`Texto extraído de la imagen`);

    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const number = parseInt(numbers[0], 10);
      return { number, index };
    } else {
      console.log(`No se encontraron números en la imagen ${index}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error procesando la imagen ${index}:`, error);
    return null;
  }
};

module.exports = { cropImage, processImage };
