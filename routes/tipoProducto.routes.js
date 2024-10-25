import { Router } from "express";
import { createTipoProducto, findAll, findById } from "../db/actions/tipoProducto.actions.js";

const router = Router();

router.get('/tipoProductos', async(req, res) => {
    try{
        const result = await findAll()
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.get('/tipoProductoPorID/:id', async(req, res) => {
  const id = req.params.id  
  try {
      const result = await findById(id)
      res.status(200).json(result)
  }catch(error){
      res.status(400).json()
  }
})

router.post('/nuevoTipoProducto', async (req, res) => {
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
