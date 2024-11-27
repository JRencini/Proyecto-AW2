export const fetchProductos = async (soloDisponibles = false, tipoProductoID = null) => {
  try {
    const params = new URLSearchParams();
    if (soloDisponibles) params.append('disponibles', true);
    if (tipoProductoID) params.append('tipoProducto', tipoProductoID);

    const url = `/productos/producto?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener los productos:', error);
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
export const actualizarProducto = async (formData) => {
  try {
    const id = formData.get('id'); 
    formData.delete('id');

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

export const eliminarProducto = async (id) => {
  try {
    const response = await fetch(`/productos/eliminarProducto/${id}`, {
      method: 'DELETE',
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

export const actualizarDisponibilidadProducto = async (id) => {
  try {
    const response = await fetch(`/productos/modificarDisponibilidadProducto/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
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


export const checkProductNameExists = async (nombre) => {
  try {
    const response = await fetch(`/productos/verificarNombre?nombre=${encodeURIComponent(nombre)}`);
  
    if (!response.ok) {
      throw new Error('Error al verificar el nombre del producto');
    }
    const result = await response.json();

    return result.exists;
  } catch (error) {
    console.error('Error al verificar el nombre del producto:', error);
    return false;
  }
};



