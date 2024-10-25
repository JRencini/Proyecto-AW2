import { connectToDatabase } from "../connection.js";
import Pedido from "../schemas/pedidos.schema.js";
import mongoose from "mongoose";

export const createPedido = async ({ cliente, fecha, cuerpo, total }) => {
  try {
    const pedido = new Pedido({
      cliente: cliente,
      fecha,
      cuerpo: cuerpo.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad,
        observaciones: item.observaciones
      })),
      total
    });
    const pedidoGuardado = await pedido.save();
    return pedidoGuardado;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};

export const findAllPedidos = async () => {
  try {
    await connectToDatabase();
    const pedidos = await Pedido.find();
    return JSON.parse(JSON.stringify(pedidos));
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
};

export const findPedidoById = async (id) => {
  try {
    await connectToDatabase();
    const pedido = await Pedido.findById(id);
    if (!pedido) throw new Error('Pedido no encontrado');
    return JSON.parse(JSON.stringify(pedido));
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    throw error;
  }
};

export const updatePedido = async (id, { idCliente, fecha, cuerpo, total }) => {
  try {
    await connectToDatabase();
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id, { idCliente, fecha, cuerpo, total }, { new: true }
    );
    if (!pedidoActualizado) throw new Error('Pedido no encontrado');
    return JSON.parse(JSON.stringify(pedidoActualizado));
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    throw error;
  }
};

export const deletePedido = async (id) => {
  try {
    await connectToDatabase();
    const pedidoEliminado = await Pedido.findByIdAndDelete(id);
    if (!pedidoEliminado) throw new Error('Pedido no encontrado');
    return JSON.parse(JSON.stringify(pedidoEliminado));
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw error;
  }
};
