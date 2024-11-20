export const fetchProductos = async () => {
  try {
    const response = await fetch('/productos/productos');
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};

export const fetchProductosPorCategoria = async (tipoProductoID) => {
  try {
    const response = await fetch(`/productos/productosPorTipo/${tipoProductoID}`);
    if (!response.ok) {
      throw new Error('Error al obtener productos por categoría');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error;
  }
};
