import { addSession } from "../utils/sessionStorage.controller.js"

const btnLogin = document.getElementById('btnLogin');

const auth = async ({ email, pass }) => {
  const response = await fetch('/clientes/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "email": email, "password": pass })
  });

  if (!response.ok) {
    throw new Error('Error en la autenticación');
  }

  const { token } = await response.json();
  return token;
};

const getClienteData = async (token) => {
  const response = await fetch('/clientes/info', {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener datos del cliente');
  }

  return await response.json(); 
};

btnLogin.addEventListener('click', async () => {
  const email = document.getElementById('txtEmail').value;
  const pass = document.getElementById('txtPass').value;

  if (email !== '' && pass !== '') {
    try {
      console.log('eskere')
      const token = await auth({ email, pass }); 
      const clienteData = await getClienteData(token);
      
      console.log('eskere')
      addSession({
        token,
        clienteData 
      });

      console.log('eskere')
      window.location.href = "../home/home.html";
    } catch (error) {
      console.error(error);
      alert('No se encontró usuario o hubo un error en el login');
    }
  } else {
    alert('Complete los campos requeridos');
  }
});
