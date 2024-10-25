export const fetchProductos = async () => {
  const response = await fetch('/productos/productos');
  return response.json();
};

export const fetchProductosPorCategoria = async (tipoProductoID) => {
  const response = await fetch(`/productos/productosPorTipo/${tipoProductoID}`);
  return response.json();
};