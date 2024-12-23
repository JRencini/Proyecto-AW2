import { checkProductNameExists } from "../api/productos.js";
import { fetchTiposProducto } from "../api/tipoProducto.js";

export const productFormComponent = ({ id, nombre, descripcion, precio, imagenId, tipoProducto, onSave }) => {
  const originalNombre = nombre; 
  const modalBackdrop = document.createElement('div');
  modalBackdrop.classList.add('modal-backdrop');
  document.body.appendChild(modalBackdrop);

  const modal = document.createElement('div');
  modal.classList.add('product-modal');
  const defaultImageUrl = '../../images/default-image.jpg'; 

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Cerrar modal">&times;</button>
      <div id="alert" class="alert alert-danger d-none" role="alert"></div>
      <img src="${imagenId ? `/images/${imagenId}` : defaultImageUrl}" class="product-img" alt="${nombre || 'Producto'}">
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

        <button class="btn btn-success mt-3" id="saveProductBtn" aria-label="Modificar Producto">Modificar Producto</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  fetchTiposProducto().then(tiposProducto => {
    const tipoProductoSelect = document.getElementById('tipoProducto');
    tiposProducto.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo._id;
      option.textContent = tipo.nombre;
      tipoProductoSelect.appendChild(option);
    });
  });

  modal.querySelector('.close-btn').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  function closeModal() {
    modal.remove();
    modalBackdrop.remove();
  }

  modal.querySelector('#saveProductBtn').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const nombreExists = await checkProductNameExists(nombre);
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const tipoProducto = document.getElementById('tipoProducto').value;

    // Validación del formulario
    if (nombre.length < 3) {
      showAlert('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!precio || precio <= 0) {
      showAlert('El precio debe ser mayor a 0.');
      return;
    }
    if (!tipoProducto) {
      showAlert('Debes seleccionar un tipo de producto.');
      return;
    }
    if (nombreExists && nombre !== originalNombre) {
      showAlert('El nombre del producto ya existe. Por favor, elige otro nombre.');
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('tipoProducto', tipoProducto);

    await onSave({ formData });

    closeModal();
  });

  function showAlert(message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.textContent = message;
    alertDiv.classList.remove('d-none');
  }

  return modal;
};
