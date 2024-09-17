const fs = require('fs');
const axios = require('axios');

const downloadImage = async (url, imagePath) => {
  const writer = fs.createWriteStream(imagePath);
  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error descargando la imagen:', error);
    throw error;
  }
};

module.exports = { downloadImage };
