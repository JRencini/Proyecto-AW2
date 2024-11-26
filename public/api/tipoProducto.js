export const fetchTiposProducto = async () => {
  try {
    const response = await fetch('/tipoProducto/tipoProductos');  
    if (!response.ok) {
      throw new Error('Error al obtener los tipos de producto');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener los tipos de producto:', error);
    throw error;
  }
};
