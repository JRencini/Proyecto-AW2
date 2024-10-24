import { connectToDatabase } from "../connection.js"
import TipoProducto from "../schemas/tipoProducto.schema.js";

export const createTipoProducto = async ({ codigo, nombre, descripcion }) => {
  try {
    await connectToDatabase();
    const res = await TipoProducto.create({ codigo, nombre, descripcion });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el producto en MongoDB:', error);
    throw error;
  }
};