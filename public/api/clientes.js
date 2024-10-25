export const fetchObtenerClienteXEmail = async (email) => {
  const response = await fetch(`/clientes/buscarPorEmail/${email}`);
  return response.json();
};
