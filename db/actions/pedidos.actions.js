import { connectToDatabase } from "../connection.js";
import Pedido from "../schemas/pedidos.schema.js";

export const createPedido = async ({ idCliente, fecha, cuerpo, total }) => {
  try {
    await connectToDatabase();
    
    const nuevoPedido = {
      idCliente,
      fecha,
      cuerpo,  // Array de objetos que incluye idProducto, cantidad, observaciones
      total
    };
    
    const res = await Pedido.create(nuevoPedido);
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el pedido en MongoDB:', error);
    throw error;
  }
};
