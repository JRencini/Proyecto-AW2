import { Router } from "express";
import { createProducto, findById, findAll, findByTipo, actualizarProducto, eliminarProducto } from "../db/actions/productos.actions.js";
import { upload, saveFileToGridFS } from '../db/multer.js';
import processImage from '../db/imageProcessor.js';
import enhanceImage from '../db/imageEnhancer.js';
import Producto from "../db/schemas/productos.schema.js";
import mongoose from "mongoose";
import { connectToDatabase } from '../db/connection.js'; 

const router = Router();

router.get('/productos', async (req, res) => {
  try {
    const result = await findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

router.get('/productosPorID/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El ID del producto es obligatorio" });
  }

  try {
    const result = await findById(id);
    if (!result) {
      return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

router.get('/productosPorTipo/:id', async (req, res) => {
  const tipoProducto = req.params.id;

  if (!tipoProducto) {
    return res.status(400).json({ message: "El ID del tipo de producto es obligatorio" });
  }

  try {
    const result = await findByTipo(tipoProducto);
    if (!result.length) {
      return res.status(404).json({ message: "No se encontraron productos para la categoría indicada" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener productos por tipo:', error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

router.put('/modificarProducto/:id', upload.single('imagen'), processImage, enhanceImage, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, tipoProducto, disponible } = req.body;
  const imagenId = req.file ? req.file.id : undefined;

  if (!id) {
    return res.status(400).json({ message: "El ID del producto es obligatorio" });
  }
  try {
    if (nombre) {
      const productoExistente = await Producto.findOne({ nombre });
      if (productoExistente && productoExistente._id.toString() !== id) {
        return res.status(400).json({ message: 'El nombre del producto ya existe.' });
      }
    }
    const data = { 
      nombre, 
      descripcion, 
      precio, 
      tipoProducto, 
      disponible, 
      ...(imagenId && { imagenId }) 
    };
    const productoActualizado = await actualizarProducto(id, data);
    res.status(200).json({ 
      message: "El producto fue modificado exitosamente", 
      producto: productoActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});


router.post('/nuevoProducto', upload.single('imagen'), processImage, enhanceImage, saveFileToGridFS, async (req, res) => {
  const { nombre, descripcion, precio, tipoProducto } = req.body;
  const imagenId = req.file ? req.file.id : null;

  if (!nombre || !descripcion || !precio || !imagenId || !tipoProducto) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }

  try {
    const result = await createProducto({ nombre, descripcion, precio, imagenId, tipoProducto });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: `Error al crear el producto: ${error.message}` });
  }
});

router.delete('/eliminarProducto/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El ID del producto es obligatorio" });
  }

  try {
    const producto = await findById(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (producto.imagenId) {
      const { conn, gfs } = await connectToDatabase();
      const fileId = new mongoose.Types.ObjectId(producto.imagenId);

      await gfs.delete(fileId); 
    }
    const productoEliminado = await eliminarProducto(id);

    res.status(200).json({ 
      message: "El producto y su imagen asociada fueron eliminados exitosamente", 
      producto: productoEliminado 
    });
  } catch (error) {
    console.error("Error al eliminar el producto o su imagen:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});
// Verificar si el nombre del producto ya existe
router.get('/verificarNombre', async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) {
    return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
  }

  try {
    const producto = await Producto.findOne({ nombre });
    res.status(200).json({ exists: !!producto });
  } catch (error) {
    console.error('Error al verificar el nombre del producto:', error);
    res.status(500).json({ message: 'Error al verificar el nombre del producto' });
  }
});


export default router;
