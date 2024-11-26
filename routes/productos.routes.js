import { Router } from "express";
import { createProducto, findById, findAll, findByTipo, actualizarProducto, eliminarProducto } from "../db/actions/productos.actions.js";
import { upload, saveFileToGridFS } from '../db/multer.js';
import processImage from '../db/imageProcessor.js';
import enhanceImage from '../db/imageEnhancer.js';

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
    const data = { nombre, descripcion, precio, tipoProducto, disponible, ...(imagenId && { imagenId }) };
    const productoActualizado = await actualizarProducto(id, data);
    
    res.status(200).json({ message: "El producto fue modificado exitosamente", producto: productoActualizado });
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
    const productoEliminado = await eliminarProducto(id);
    res.status(200).json({ message: "El producto fue eliminado exitosamente", producto: productoEliminado });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

export default router;
