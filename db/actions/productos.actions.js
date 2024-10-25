import { connectToDatabase } from "../connection.js"
import Producto from "../schemas/productos.schema.js"

export const createProducto = async ({nombre, descripcion, precio, imagen, tipoProducto }) => {
  try {
    await connectToDatabase();
    const res = await Producto.create({nombre, descripcion, precio, imagen, tipoProducto });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
};

export const findAll = async () => {
  try {
    await connectToDatabase();
    const res = await Producto.find();
    return  JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.error('Error al buscar los productos:', error);
  }
}

export const findById = async (id) => {
  try {
    await connectToDatabase();
    const res = await Producto.findById(id);
    return  JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.error('Error al buscar los productos:', error);
  }
}
export const findByTipo = async (tipoProducto) => {
  try{
      await connectToDatabase()
      const res = await Producto.find({tipoProducto}).populate({path:"tipoProducto"})
      return JSON.parse(JSON.stringify(res))
  }catch(error){
      console.log(error)
  }
}