import { connectToDatabase } from "../connection.js";
import Producto from "../schemas/productos.schema.js";

export const createProducto = async ({ nombre, descripcion, precio, imagenId, tipoProducto, disponible = true }) => {
  try {
    await connectToDatabase();
    const res = await Producto.create({ nombre, descripcion, precio, imagenId, tipoProducto, disponible });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('Error al crear el producto');
  }
};


export const findAll = async (filter = {}) => {
  try {
    await connectToDatabase();
    const res = await Producto.find(filter).populate('tipoProducto');
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al buscar los productos:', error);
    throw error;
  }
};


export const findById = async (id) => {
  try {
    await connectToDatabase();
    const res = await Producto.findById(id).populate('tipoProducto');
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al buscar el producto:', error);
  }
};

export const findByTipo = async (tipoProducto) => {
  try {
    await connectToDatabase();
    const res = await Producto.find({ tipoProducto }).populate('tipoProducto');
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al buscar los productos por tipo:', error);
  }
};

export const actualizarProducto = async (id, data) => {
  try {
    await connectToDatabase();
    const res = await Producto.findByIdAndUpdate(id, data, { new: true }).populate('tipoProducto');
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
};

export const eliminarProducto = async (id) => {
  try {
    await connectToDatabase();
    const res = await Producto.findByIdAndDelete(id);
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
};
