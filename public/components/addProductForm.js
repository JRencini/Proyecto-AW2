import { checkProductNameExists } from "../api/productos.js";
import { fetchTiposProducto } from "../api/tipoProducto.js";

export const addProductFormComponent = ({ onSave }) => {
  const modal = document.createElement('div');
  modal.classList.add('product-modal');
  const backdrop = document.createElement('div');
  backdrop.classList.add('modal-backdrop');
  document.body.appendChild(backdrop);

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Cerrar modal">&times;</button>
      <div class="modal-body">
        <div id="alert" class="alert alert-danger d-none" role="alert"></div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" class="form-control" aria-label="Nombre">

        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" class="form-control" rows="3" aria-label="Descripción"></textarea>

        <label for="precio">Precio:</label>
        <input type="number" id="precio" class="form-control" aria-label="Precio">

        <label for="tipoProducto">Tipo de Producto:</label>
        <select id="tipoProducto" class="form-control" aria-label="Tipo de Producto">
          <!-- Las opciones se agregarán dinámicamente -->
        </select>

        <label for="imagen">Imagen:</label>
        <input type="file" id="imagen" class="form-control" aria-label="Imagen">

        <button class="btn btn-success mt-3" id="saveProductBtn" aria-label="Agregar Producto">Agregar Producto</button>
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
  backdrop.addEventListener('click', closeModal);

  function closeModal() {
    modal.remove();
    backdrop.remove();
  }

  modal.querySelector('#saveProductBtn').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const nombreExists = await checkProductNameExists(nombre);
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const tipoProducto = document.getElementById('tipoProducto').value;
    const imagenFile = document.getElementById('imagen').files[0];

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
    if (!imagenFile) {
      showAlert('Debes seleccionar una imagen.');
      return;
    }
    if (nombreExists) {
      showAlert('El nombre del producto ya existe. Por favor, elige otro nombre.');
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

  function showAlert(message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.textContent = message;
    alertDiv.classList.remove('d-none');
  }

  return modal;
};
