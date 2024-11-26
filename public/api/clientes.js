export const fetchObtenerClienteXEmail = async (email) => {
  try {
    const response = await fetch(`/clientes/buscarPorEmail/${email}`);
    if (!response.ok) {
      throw new Error('Error al obtener el cliente por email');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    throw error;
  }
};

export const crearCliente = async (cliente) => {
  try {
    const response = await fetch('/clientes/nuevoCliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      throw new Error('Error al crear el cliente');
    }
    return response.json();
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    throw error;
  }
};

