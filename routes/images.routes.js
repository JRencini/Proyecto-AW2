import { Router } from 'express';
import { connectToDatabase } from '../db/connection.js';
import { GridFSBucket } from 'mongodb';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { conn } = await connectToDatabase();

    const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (error) => {
      console.error('Error al descargar el archivo:', error);
      res.sendStatus(404);
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error('Error al conectar a GridFS:', error);
    res.status(500).json({ message: 'Error al conectar a GridFS' });
  }
});

export default router;
