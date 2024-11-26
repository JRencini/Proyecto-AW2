export const productFormComponent = ({ id, nombre, descripcion, precio, imagen, tipoProducto, onSave, isEdit }) => {
  const modal = document.createElement('div');
  modal.classList.add('product-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Cerrar modal">&times;</button>
      <img src="${imagen || ''}" class="product-img" alt="${nombre || 'Nuevo Producto'}">
      <div class="modal-body">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" class="form-control" value="${nombre || ''}" aria-label="Nombre">

        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" class="form-control" rows="3" aria-label="Descripción">${descripcion || ''}</textarea>

        <label for="precio">Precio:</label>
        <input type="number" id="precio" class="form-control" value="${precio || ''}" aria-label="Precio">

        <label for="tipoProducto">Tipo de Producto:</label>
        <select id="tipoProducto" class="form-control" aria-label="Tipo de Producto">
          <!-- Las opciones se agregarán dinámicamente -->
        </select>

        <label for="imagen">Imagen:</label>
        <input type="file" id="imagen" class="form-control" aria-label="Imagen">

        <button class="btn btn-success mt-3" id="saveProductBtn" aria-label="${isEdit ? 'Modificar Producto' : 'Agregar Producto'}">${isEdit ? 'Modificar Producto' : 'Agregar Producto'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Cargar las opciones de tipo de producto dinámicamente
  loadTiposProducto();

  modal.querySelector('.close-btn').addEventListener('click', closeModal);

  function closeModal() {
    modal.remove();
  }

  modal.querySelector('#saveProductBtn').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const tipoProducto = document.getElementById('tipoProducto').value;
    const imagenFile = document.getElementById('imagen').files[0];

    // Validación del formulario
    if (nombre.length < 3) {
      alert('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!precio || precio <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }
    if (!tipoProducto) {
      alert('Debes seleccionar un tipo de producto.');
      return;
    }
    if (!imagenFile) {
      alert('Debes seleccionar una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('tipoProducto', tipoProducto);
    formData.append('imagen', imagenFile);

    await onSave({ formData });

    closeModal();
  });

  return modal;
};

// Función para cargar los tipos de producto
async function loadTiposProducto() {
  try {
    const response = await fetch('/tipoProducto/tipoProductos');
    const tiposProducto = await response.json();
    const tipoProductoSelect = document.getElementById('tipoProducto');
    tiposProducto.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo._id;
      option.textContent = tipo.nombre;
      tipoProductoSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar los tipos de producto:', error);
  }
}
