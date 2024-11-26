import multer from 'multer';
import { connectToDatabase } from './connection.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limitar el tamaño del archivo a 2MB
  fileFilter: function (req, file, cb) {
    // Aceptar solo imágenes
    if (!file.mimetype.startsWith('image/')) {
      console.log('Solo se permiten archivos de imagen');
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  },
});

const saveFileToGridFS = async (req, res, next) => {
  console.log('Middleware saveFileToGridFS iniciado.');

  if (!req.file) {
    console.log('No se recibió ningún archivo para subir.');
    return next(new Error('No se recibió ningún archivo para subir.'));
  }

  console.log(`Archivo recibido: ${req.file.originalname}`);
  console.log(`Tamaño del archivo: ${req.file.size} bytes`);
  console.log(`Tipo de archivo: ${req.file.mimetype}`);

  try {
    const { gfs } = await connectToDatabase();

    if (!gfs) {
      console.error('GridFS no está inicializado.');
      throw new Error('GridFS no está disponible. Verifica la conexión y la inicialización.');
    }

    console.log('Conectado a GridFS. Preparando para subir el archivo...');

    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      console.log('Archivo subido con éxito. ID:', uploadStream.id);
      req.file.id = uploadStream.id; // Asignar el ID del archivo a req.file para usarlo después
      next();
    });

    uploadStream.on('error', (error) => {
      console.error('Error al subir archivo a GridFS:', error);
      next(error);
    });
  } catch (error) {
    console.error('Error en saveFileToGridFS:', error.message);
    next(error);
  }
};

export { upload, saveFileToGridFS };
