import { getSession } from "../../utils/sessionStorage.controller.js";

const txtNombre = document.getElementById('txtNombre')

const user = getSession('user')
console.log(user)
txtNombre.textContent = `Hola ${user.name}`