import { Router } from "express";
import { createTipoProducto, findAll, findById } from "../db/actions/tipoProducto.actions.js";

const router = Router();

router.get('/tipoProductos', async (req, res) => {
  try {
    const result = await findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener los tipos de productos:', error);
    res.status(500).json({ message: "Error al obtener los tipos de productos" });
  }
});

router.get('/tipoProductoPorID/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El ID del tipo de producto es obligatorio" });
  }

  try {
    const result = await findById(id);
    if (!result) {
      return res.status(404).json({ message: `Tipo de producto con ID ${id} no encontrado` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener el tipo de producto por ID:', error);
    res.status(500).json({ message: "Error al obtener el tipo de producto" });
  }
});

router.post('/nuevoTipoProducto', async (req, res) => {
  const { codigo, nombre, descripcion } = req.body;
  if (!codigo || !nombre || !descripcion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const result = await createTipoProducto({ codigo, nombre, descripcion });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el tipo de producto:', error);
    res.status(500).json({ message: "Error al crear el tipo de producto" });
  }
});

export default router;
