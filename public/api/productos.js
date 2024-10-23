export const fetchProductos = async () => {
  const response = await fetch('/productos/obtenerProductos');
  return response.json();
};

export const fetchProductosPorCategoria = async (categoryCode) => {
  const response = await fetch(`/productos/obtenerProductosPorCategoria/${categoryCode}`);
  return response.json();
};