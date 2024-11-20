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
