export const crearPedido = async (pedido) => {
  try {
    const response = await fetch('/pedidos/nuevoPedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) {
      throw new Error('Error al crear el pedido');
    }
    return response.json();
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};
