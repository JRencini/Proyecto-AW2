import { notificacionConst } from "./notificaciones.js";

//const userData = sessionStorage.getItem('userData');
//const user = JSON.parse(userData);

let idUsuario = '';
let fullName = '';
let hayUsuario = '';
let noHayUsuario = '';
let noHayNotificaciones = '';
let notificacionHTML = '';

/*async function getNotifications() {
  if (user) {
    idUsuario = user.id;
    fullName = `${user.nombre} ${user.apellido}`;
    hayUsuario = 'href="../usuario/miUsuario.html"';
    
    try {
      const res = await fetch('../../data/notificaciones.json');
      const data = await res.json();
      const dataFiltrada = data
        .filter(e => e.idUsuario == idUsuario)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3);
      notificacionHTML = dataFiltrada.map(i => notificacionConst(i.id, i.fecha, i.desc)).join('');
      if (notificacionHTML != '') {
        noHayNotificaciones = 'd-none'
      }
    } catch (error) {
      console.error('Error al cargar el JSON:', error);
    }
  } else {
    noHayUsuario = 'd-none';
  }
}*/

async function buildNavBar() {
  //await getNotifications();
  
  const navElements = [
    { title: 'Accesorios', link: '../categorias/catAccesorios.html' },
    { title: 'Hardware', link: '../categorias/catHardware.html' },
    { title: 'Software', link: '../categorias/catSoftware.html' },
  ];

  return `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="../home/home.html">
          <img src="../../imagenes/ICONO.png" alt="HardWhere?" class="me-2" width="35px">
          HardWhere?
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mb-2 mb-lg-0">
            ${navElements.map(e => `
                <li class="nav-item">
                  <a class="nav-link active" href=${e.link}>${e.title}</a>
                </li>
              `).join('')}
          </ul>
          <div class="d-flex ms-auto align-items-center justify-content-end">
            <a class="navbar-brand ${noHayUsuario}" ${hayUsuario} >
              <span class="navbar-text me-2" id="lblUser">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                ${fullName}
              </span>
            </a>
            <div class="dropdown ${noHayUsuario}">
              <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                </svg>
              </button>          
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" style="width: 20rem;">         
                <div class="card">
                  <div class="card-header">Notificaciones</div>
                  <div class="card-body">          
                    <div class="mt-5 mb-5 ${noHayNotificaciones}">                               
                      <p class="text-secondary text-center"> No hay notificaciones</p>               
                    </div>
                    <ul class="list-group list-group-item-light rounded-2">                
                      <div> ${notificacionHTML}</div>            
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
            <a class="navbar-brand" href="../cart/carrito.html">
              <button id="btnCart" class="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
              </button>
            </a>
            <button id="btnLogout" class="btn btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export { buildNavBar };
