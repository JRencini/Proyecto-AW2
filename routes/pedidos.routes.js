import { Router } from "express";
import { createPedido, findAllPedidos, findPedidoById, updatePedido, deletePedido } from "../db/actions/pedidos.actions.js";

const router = Router();

router.post('/nuevoPedido', async (req, res) => {
  const { cliente, fecha, cuerpo, total } = req.body;
  if (!cliente || !fecha || !cuerpo || !total) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const nuevoPedido = await createPedido({ cliente, fecha, cuerpo, total });
    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
});

router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await findAllPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
});

router.get('/pedido/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID de pedido es obligatorio" });
  }

  try {
    const pedido = await findPedidoById(id);
    if (!pedido) {
      return res.status(404).json({ message: `Pedido con ID ${id} no encontrado` });
    }
    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
});

router.put('/actualizarPedido/:id', async (req, res) => {
  const { id } = req.params;
  const { idCliente, fecha, cuerpo, total } = req.body;

  if (!id || !idCliente || !fecha || !cuerpo || !total) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const pedidoActualizado = await updatePedido(id, { idCliente, fecha, cuerpo, total });
    if (!pedidoActualizado) {
      return res.status(404).json({ message: `Pedido con ID ${id} no encontrado` });
    }
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
});

router.delete('/eliminarPedido/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID de pedido es obligatorio" });
  }

  try {
    const pedidoEliminado = await deletePedido(id);
    if (!pedidoEliminado) {
      return res.status(404).json({ message: `Pedido con ID ${id} no encontrado` });
    }
    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
});

export default router;
