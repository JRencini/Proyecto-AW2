import { addSession } from "../utils/sessionStorage.controller.js"

const btnLogin = document.getElementById('btnLogin')
const auth = async ({ email, pass }) => {

  const user = await fetch('http://localhost:5000/clientes/login', {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({"email":email, "password":pass})
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Error en la peticion')
    }
    return res.json()
  }).catch(error => {
    console.log('Error: ',error)
    throw new Error('Error en la peticion')
  })
  return user
}

btnLogin.addEventListener('click', async() => {
  const email = document.getElementById('txtEmail').value
  const pass = document.getElementById('txtPass').value
  
  if (email != '' && pass != '') {
    try {     
      const user = await auth({ email, pass })
      addSession(user)
      window.location.href="../home/home.html"
    } catch (error) {
      alert('No se encontro usuario')
    }
  } else {
     alert('Complete los campos requeridos')
  }

})