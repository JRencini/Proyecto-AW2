// Obtener todos los productos
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

// Obtener productos por categoría
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

// Crear producto
export const crearProducto = async (formData) => {
  try {
    const response = await fetch('/productos/nuevoProducto', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al agregar el producto: ${errorData.message}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    throw error;
  }
};

// Actualizar producto
export const actualizarProducto = async (id, formData) => {
  try {
    const response = await fetch(`/productos/modificarProducto/${id}`, {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al modificar el producto: ${errorData.message}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al modificar el producto:', error);
    throw error;
  }
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  try {
    const response = await fetch(`/productos/eliminarProducto/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al eliminar el producto: ${errorData.message}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};
