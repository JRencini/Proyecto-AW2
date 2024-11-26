import { crearCliente } from '../../api/clientes.js'; 

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registro');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!nombre || !email || !password) {
      alert('Los campos nombre, email y contraseña son obligatorios');
      return;
    }

    const cliente = { nombre, telefono: telefono || null, email, password };

    try {
      const response = await crearCliente(cliente);
      alert('Registro exitoso');
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      alert('Error al registrar. Inténtalo nuevamente más tarde.');
    }
  });
});
