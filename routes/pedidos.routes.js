import { Router } from "express";
import { readFile, writeFile } from 'fs/promises' 

const filePedidos = await readFile('./data/pedidos.json', "utf-8")
const pedidosData = JSON.parse(filePedidos)

const router = Router()

const convertirFecha = (fechaStr) => {
  const [dia, mes, año] = fechaStr.split('/');
  return new Date(`${año}-${mes}-${dia}`); 
};

router.post('/pedidosDesdeHasta', async (req, res) => {
  const { desde, hasta } = req.body;

  if (!desde || !hasta) {
      return res.status(400).json({ message: "Debes proporcionar las fechas 'desde' y 'hasta'" });
  }
  try {
    const fechaDesde = convertirFecha(desde);
    const fechaHasta = convertirFecha(hasta);

    if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
      return res.status(400).json({ message: "Fechas no válidas" });
    }

    const pedidosFiltrados = pedidosData.filter(pedido => {
      const fechaPedido = convertirFecha(pedido.fecha); 
      return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta;
    });

    if (pedidosFiltrados.length > 0) {
      res.status(200).json(pedidosFiltrados);
    } else {
      res.status(404).json({ message: `No hay pedidos entre ${desde} y ${hasta}` });
    }
    } catch (error) {
      res.status(500).json({ message: "Error al buscar los pedidos", error });
    }
});

router.delete('/eliminarPedido/:id', (req, res) => {
  const { id } = req.params;
  try {
    const index = pedidosData.findIndex(pedido => pedido.id === parseInt(id));

    if (index !== -1) {
      pedidosData.splice(index, 1)
      writeFile('./data/pedidos.json', JSON.stringify(pedidosData, null, 2))
      res.status(200).json('Pedido eliminado exitosamente')
    } else {
      res.status(404).json('No se encontro un producto con el ID ingresado')
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
});

export default router