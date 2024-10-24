import { connectToDatabase } from "../connection.js"
import Producto from "../schemas/productos.schema.js"

export const createProducto = async ({nombre, descripcion, precio, imagen, tipoProducto }) => {
  try {
    await connectToDatabase();
    const res = await Producto.create({nombre, descripcion, precio, imagen, tipoProducto });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el producto en MongoDB:', error);
    throw error;
  }
};
