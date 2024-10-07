import { getSession } from "../../utils/sessionStorage.controller.js";


const user = getSession('user');
const txtNombre = document.getElementById('txtNombre');
txtNombre.textContent = `Hola ${user.name}`;

const totalCarrito = document.getElementById('totalCarrito');
let total = 0;

const logout = (key) => {
  sessionStorage.removeItem(key)
}
document.getElementById('btnLogout').addEventListener('click', () => {
      logout('user');
      window.location.href = '../login/login.html';
    });

function eliminarDelCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(producto => producto.id !== idProducto);
  localStorage.setItem('carrito', JSON.stringify(carrito))
  renderCart();
}

function agregarEventosQuitar() {
  const botonesQuitar = document.querySelectorAll('.btn-quitar');

  botonesQuitar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = parseInt(e.target.dataset.idProducto);
      eliminarDelCarrito(idProducto);
    });
  });
}

function renderCart() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const cartContainer = document.getElementById('cartItems');
  total = 0;

  if (carrito.length === 0) {
    cartContainer.innerHTML = '<p>No hay productos en el carrito</p>';
    return;
  }

  const productosHTML = carrito.map(producto => {
    total += producto.precio * producto.cantidad;

    return `
      <div class="d-flex items-center border-bottom py-2 cart-item justify-content-between">
        <div class="relative flex items-center">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="cartItem-img">
          <div>
            <h1 class="text-xl ml-8"><strong>${producto.nombre}</strong></h1>
            <p class="text-sm ml-8 mt-6">Observaciones: ${producto.observaciones || 'Ninguna'}</p>
          </div>
        </div>
        <div> 
          <p class="mb-0"><strong>Precio:</strong> ${producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
          <p class="text-sm ml-8 mt-6">Cantidad: ${producto.cantidad}</p>       
          <button class="btn btn-danger btn-quitar text-sm mt-6" data-id-producto="${producto.id}">Quitar del carrito</button>
        </div>
      </div>
    `;
  }).join('');

  cartContainer.innerHTML = productosHTML;
  totalCarrito.textContent = total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  agregarEventosQuitar();
}

function finalizarCompra() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  const user = getSession('user');
  const idCliente = user.id; 

  const pedido = {
    id: Date.now(), 
    idCliente: idCliente,
    fecha: new Date().toLocaleDateString('es-AR'),
    cuerpo: carrito.map(producto => ({
      idProducto: producto.id,
      cantidad: producto.cantidad,
      observaciones: producto.observaciones || ''
    })),
    total: total 
  };

  fetch('/pedidos/nuevoPedido', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Pedido enviado:', data);
    alert('Compra finalizada con éxito!');
    
    localStorage.removeItem('carrito');
    total = 0;
    totalCarrito.textContent = "";
    renderCart(); 
  })
  .catch(error => {
    console.error('Error al finalizar la compra:', error);
    alert('Ocurrió un error al finalizar la compra.');
  });
}

document.getElementById('btnCompra').addEventListener('click', finalizarCompra);

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});
