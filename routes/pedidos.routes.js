
import { Router } from "express";
import { createPedido, findAllPedidos, findPedidoById, updatePedido, deletePedido } from "../db/actions/pedidos.actions.js";

const router = Router();

router.post('/nuevoPedido', async (req, res) => {
  const { cliente, fecha, cuerpo, total } = req.body;
  try {
    const nuevoPedido = await createPedido({ cliente, fecha, cuerpo, total });
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido" });
  }
});

router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await findAllPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
});

router.get('/pedido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await findPedidoById(id);
    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/actualizarPedido/:id', async (req, res) => {
  const { id } = req.params;
  const { idCliente, fecha, cuerpo, total } = req.body;

  try {
    const pedidoActualizado = await updatePedido(id, { idCliente, fecha, cuerpo, total });
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/eliminarPedido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await deletePedido(id);
    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
