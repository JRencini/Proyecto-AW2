import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { createTipoProducto } from "../db/actions/tipoProducto.actions.js";

const fileTipoProducto = await readFile('./data/tipoProducto.json', "utf-8");
const tipoProductoData = JSON.parse(fileTipoProducto);
const router = Router();

router.get('/obtenerTiposProducto', (req, res) => {
  if (tipoProductoData.length > 0) {
    res.status(200).json(tipoProductoData);
  } else {
    res.status(400).json('No se pudieron cargar los tipos de producto');
  }
});

router.get('/obtenerTipoProducto/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  const result = tipoProductoData.find(e => e.codigo === codigo);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json(`No se encontró el tipo de producto con el código: ${codigo}`);
  }
});

router.post('/nuevoTipoProducto', async (req, res) => {
  const { codigo, nombre, descripcion } = req.body;

  if (!codigo || !nombre || !descripcion) {
    return res.status(400).json({ message: "Todos los campos del tipo de producto son obligatorios" });
  }

  const nuevoTipoProducto = {
    codigo,
    nombre,
    descripcion
  };

  try {
    tipoProductoData.push(nuevoTipoProducto);
    await writeFile('./data/tipoProducto.json', JSON.stringify(tipoProductoData, null, 2), 'utf-8');
    res.status(201).json(nuevoTipoProducto);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el nuevo tipo de producto" });
  }
});

router.put('/modificarTipoProducto', async (req, res) => {
  const { codigo, new_nombre, new_descripcion } = req.body;

  try {
    const index = tipoProductoData.findIndex(e => e.codigo === codigo);

    if (index === -1) {
      return res.status(404).json({ message: "Tipo de producto no encontrado" });
    }

    if (new_nombre) tipoProductoData[index].nombre = new_nombre;
    if (new_descripcion) tipoProductoData[index].descripcion = new_descripcion;

    await writeFile('./data/tipoProducto.json', JSON.stringify(tipoProductoData, null, 2), 'utf-8');
    res.status(200).json({ message: "El tipo de producto fue modificado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el tipo de producto" });
  }
});

router.post('/create', async (req, res) => {
  const { codigo, nombre, descripcion } = req.body;
  if (!codigo || !nombre || !descripcion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const result = await createTipoProducto({ codigo, nombre, descripcion });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el tipo producto" });
  }
});

export default router;
