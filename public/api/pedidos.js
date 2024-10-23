export const crearPedido = async (pedido) => {
  const response = await fetch('/pedidos/nuevoPedido', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  });
  return response.json();
};