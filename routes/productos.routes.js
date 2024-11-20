import { Router } from "express";
import { createProducto, findById, findAll, findByTipo } from "../db/actions/productos.actions.js";

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

router.put('/modificarProducto', async (req, res) => {
  const { id, new_nombre, new_descripcion, new_precio, new_imagen, new_tipoProducto } = req.body;

  if (!id) {
    return res.status(400).json({ message: "El ID del producto es obligatorio" });
  }

  try {
    const producto = await findById(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (new_nombre) producto.nombre = new_nombre;
    if (new_descripcion) producto.descripcion = new_descripcion;
    if (new_precio) producto.precio = parseFloat(new_precio);
    if (new_imagen) producto.imagen = new_imagen;
    if (new_tipoProducto) producto.tipoProducto = new_tipoProducto;

    const productoActualizado = await producto.save();
    res.status(200).json({ message: "El producto fue modificado exitosamente", producto: productoActualizado });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

router.post('/nuevoProducto', async (req, res) => {
  const { nombre, descripcion, precio, imagen, tipoProducto } = req.body;

  if (!nombre || !descripcion || !precio || !imagen || !tipoProducto) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }

  try {
    const result = await createProducto({ nombre, descripcion, precio, imagen, tipoProducto });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
});

export default router;
