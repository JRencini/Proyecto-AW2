export const cardComponent = ({ id, nombre, descripcion, precio, imagen }) => {
  const formattedPrice = precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  const card = document.createElement('div');
  card.classList.add('card', 'col-md-2', 'mb-4');

  card.innerHTML = `
    <img src="${imagen}" class="card-img" alt="${nombre}">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text"><strong>${formattedPrice}</strong></p>
    </div>
  `;

  card.addEventListener('click', () => {
    openProductModal({ id, nombre, descripcion, precio, imagen });
  });

  return card;
};

function openProductModal({ id, nombre, descripcion, precio, imagen }) {
  const formattedPrice = precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  const backdrop = document.createElement('div');
  backdrop.classList.add('modal-backdrop');
  document.body.appendChild(backdrop);

  const modal = document.createElement('div');
  modal.classList.add('product-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Cerrar modal">&times;</button>
      <img src="${imagen}" class="product-img" alt="${nombre}">
      <div class="modal-body">
        <div class="mb-3 d-flex items-center justify-content-between">
          <h1 class="text-4xl"><strong>${nombre}</strong></h1>
          <p class="text-2xl"><strong>${formattedPrice}</strong></p>
        </div>
        <p class="mb-3">${descripcion}</p>
        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" class="form-control" min="1" max="5" value="1" aria-label="Cantidad">
        <label for="observaciones">Observaciones:</label>
        <textarea id="observaciones" class="form-control" rows="3" aria-label="Observaciones"></textarea>
        <button class="btn btn-success mt-3" id="addToCartBtn" aria-label="Agregar al carrito">Agregar al carrito</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  modal.querySelector('#addToCartBtn').addEventListener('click', () => {
    const cantidad = document.getElementById('cantidad').value;
    const observaciones = document.getElementById('observaciones').value;

    addToCart({ id, nombre, descripcion, precio, cantidad, observaciones, imagen });

    closeModal(); 
  });

  function closeModal() {
    modal.remove();
    backdrop.remove();
  }
}

function addToCart(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const productoExistente = carrito.find(item => item.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad = producto.cantidad;
    productoExistente.observaciones = producto.observaciones;
  } else {
    carrito.push(producto);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
