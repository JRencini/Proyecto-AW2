import { Router } from "express";
import { createProducto, findById, findAll, findByTipo } from "../db/actions/productos.actions.js";


const router = Router();

router.get('/productos', async(req, res) => {
    try{
        const result = await findAll()
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.get('/productosPorID/:id', async(req, res) => {
  const id = req.params.id  
  try {
      const result = await findById(id)
      res.status(200).json(result)
  }catch(error){
      res.status(400).json()
  }
})

router.get('/productosPorTipo/:id',async (req, res) => {
    const tipoProduco = req.params.id    
    try{
        const result = await findByTipo(tipoProduco)
        res.status(200).json(result)
    }catch(error){
        res.status(404).json({ message: "No se encontraron productos para la categoría indicada" });
    }
})

router.put('/modificarProducto', async (req, res) => {
  const { id, new_nombre, new_descripcion, new_precio, new_imagen, new_tipoProducto } = req.body;

  try {
    const index = productosData.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (new_nombre) productosData[index].nombre = new_nombre;
    if (new_descripcion) productosData[index].descripcion = new_descripcion;
    if (new_precio) productosData[index].precio = parseFloat(new_precio);
    if (new_imagen) productosData[index].imagen = new_imagen;
    if (new_tipoProducto) productosData[index].tipoProducto = new_tipoProducto;

    await writeFile('./data/productos.json', JSON.stringify(productosData, null, 2), 'utf-8');
    res.status(200).json({ message: "El producto fue modificado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

router.post('/nuevoProducto', async (req, res) => {
  const { nombre, descripcion, precio, imagen, tipoProducto } = req.body;

  if (!nombre || !descripcion || !precio || !imagen || !tipoProducto) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }
  
  try {
    const result = await createProducto({nombre, descripcion, precio, imagen, tipoProducto })

    res.status(200).json(result)
  } catch (error) {
    console.log(error)
  }
})

export default router;
