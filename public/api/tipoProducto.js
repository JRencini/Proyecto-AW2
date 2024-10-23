export const fetchTiposProducto = async () => {
  const response = await fetch('/tipoProducto/obtenerTiposProducto');
  return response.json();
};