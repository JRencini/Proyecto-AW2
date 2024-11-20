import { addSession } from "../utils/sessionStorage.controller.js";

const btnLogin = document.getElementById('btnLogin');

const auth = async ({ email, pass }) => {
  try {
    const response = await fetch('/clientes/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password: pass })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Credenciales incorrectas');
      } else if (response.status >= 500) {
        throw new Error('Error del servidor, intente más tarde');
      } else {
        throw new Error('Error en la autenticación');
      }
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getClienteData = async (token) => {
  try {
    const response = await fetch('/clientes/info', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Acceso denegado');
      } else if (response.status >= 500) {
        throw new Error('Error del servidor, intente más tarde');
      } else {
        throw new Error('Error al obtener datos del cliente');
      }
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

btnLogin.addEventListener('click', async () => {
  const email = document.getElementById('txtEmail').value;
  const pass = document.getElementById('txtPass').value;

  if (email !== '' && pass !== '') {
    try {
      const token = await auth({ email, pass });
      const clienteData = await getClienteData(token);
      
      addSession({ token, clienteData });

      window.location.href = "../home/home.html";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  } else {
    alert('Complete los campos requeridos');
  }
});
