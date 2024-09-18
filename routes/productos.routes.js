import { Router } from "express";
import { readFile, writeFile } from 'fs/promises' 

const fileProductos = await readFile('./data/productos.json', "utf-8")
const productosData = JSON.parse(fileProductos)
const router = Router()

router.post('/nuevoProducto', async (req, res) => {
  const {nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !descripcion || !precio || !imagen) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }
  const maxId = productosData.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);
  const nuevoId = maxId + 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre,
    descripcion: descripcion,
    precio: parseFloat(precio),
    imagen: imagen
  };

  try {
    productosData.push(nuevoProducto)
    await writeFile('./data/productos.json', JSON.stringify(productosData, null, 2), 'utf-8')
    res.status(201).json(nuevoProducto);

  } catch (error) {
    res.status(500).json({ message: "Error al registrar el producto nuevo"});
  }
})

router.put('/modificarProducto', async (req, res) => {
  const { id, new_nombre, new_descripcion, new_precio, new_imagen } = req.body;

  try {
    const index = productosData.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (new_nombre) {
      productosData[index].nombre = new_nombre;
    }
    if (new_descripcion) {
      productosData[index].descripcion = new_descripcion;
    }
    if (new_precio) {
      productosData[index].precio = parseFloat(new_precio);
    }
    if (new_imagen) {
      productosData[index].imagen = new_imagen;
    }

    await writeFile('./data/productos.json', JSON.stringify(productosData, null, 2), 'utf-8');
    res.status(200).json({ message: "El producto fue modificado exitosamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

export default router