import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { createProducto } from "../db/actions/productos.actions.js";

const fileProductos = await readFile('./data/productos.json', "utf-8");
const productosData = JSON.parse(fileProductos);

const fileTipoProducto = await readFile('./data/tipoProducto.json', "utf-8");
const tipoProductoData = JSON.parse(fileTipoProducto);

const router = Router();

const obtenerNombreCategoria = (codigo) => {
  const categoria = tipoProductoData.find(cat => cat.codigo === codigo);
  return categoria ? categoria.nombre : "Categoría no encontrada";
};

router.get('/obtenerProductos', (req, res) => {
  const productosConCategoria = productosData.map(producto => ({
    ...producto,
    tipoProducto: obtenerNombreCategoria(producto.tipoProducto)
  }));
  res.status(200).json(productosConCategoria);
});

router.get('/obtenerProductosPorCategoria/:codigo', (req, res) => {
  const { codigo } = req.params;
  const productosPorCategoria = productosData.filter(producto => producto.tipoProducto === codigo)
    .map(producto => ({
      ...producto,
      tipoProducto: obtenerNombreCategoria(producto.tipoProducto)
    }));
  
  if (productosPorCategoria.length > 0) {
    res.status(200).json(productosPorCategoria);
  } else {
    res.status(404).json({ message: "No se encontraron productos para la categoría indicada" });
  }
});

router.post('/nuevoProducto', async (req, res) => {
  const { nombre, descripcion, precio, imagen, tipoProducto } = req.body;

  if (!nombre || !descripcion || !precio || !imagen || !tipoProducto) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }

  const maxId = productosData.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);
  const nuevoId = maxId + 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre,
    descripcion,
    precio: parseFloat(precio),
    imagen,
    tipoProducto
  };

  try {
    productosData.push(nuevoProducto);
    await writeFile('./data/productos.json', JSON.stringify(productosData, null, 2), 'utf-8');
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el producto nuevo" });
  }
});

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

router.post('/create', async (req, res) => {
  const { nombre, descripcion, precio, imagen, tipoProductoCod } = req.body;

  if (!nombre || !descripcion || !precio || !imagen || !tipoProductoCod) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }
  
  try {
    const result = await createProducto({nombre, descripcion, precio, imagen, tipoProducto: tipoProductoCod })

    res.status(200).json(result)
  } catch (error) {
    console.log(error)
  }
})

export default router;
