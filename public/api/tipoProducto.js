export const fetchTiposProducto = async () => {
  const response = await fetch('/tipoProducto/tipoProductos');
  return response.json();
};