import sharp from 'sharp';

// Middleware para convertir y comprimir imágenes
const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Convertir la imagen a formato WebP y comprimirla
    const processedImageBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer();

    // Reemplazar el buffer original con el buffer procesado
    req.file.buffer = processedImageBuffer;

    next();
  } catch (error) {
    next(error);
  }
};

export default processImage;
