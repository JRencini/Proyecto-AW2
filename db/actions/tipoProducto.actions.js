import { connectToDatabase } from "../connection.js"
import TipoProducto from "../schemas/tipoProducto.schema.js";

export const createTipoProducto = async ({ codigo, nombre, descripcion }) => {
  try {
    await connectToDatabase();
    const res = await TipoProducto.create({ codigo, nombre, descripcion });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el tipo producto:', error);
    throw error;
  }
};

export const findAll = async () => {
  try {
    await connectToDatabase();
    const res = await TipoProducto.find();
    return  JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.error('Error al buscar los tipo producto:', error);
  }
}

export const findById = async (id) => {
  try {
    await connectToDatabase();
    const res = await TipoProducto.findById(id);
    return  JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.error('Error al buscar el tipo producto:', error);
  }
}