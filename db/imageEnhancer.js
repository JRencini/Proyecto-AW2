import sharp from 'sharp';

// Middleware para mejorar la calidad de las imágenes
const enhanceImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Aplicar mejoras a la imagen usando sharp
    const enhancedImageBuffer = await sharp(req.file.buffer)
      .sharpen()  // Aumentar la nitidez
      .withMetadata()  // Preservar la metadata de la imagen original
      .toBuffer();

    req.file.buffer = enhancedImageBuffer;

    next();
  } catch (error) {
    next(error);
  }
};

export default enhanceImage;
