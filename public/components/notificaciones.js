export const notificacionConst = (id, fecha, desc) => {

  return `
    <li data-id=${id} class="list-group-item">
                  <p class="text-secondary">${fecha}</p>
                  ${desc}
                </li>`;
};
