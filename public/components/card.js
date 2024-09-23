export const cardComponent = (id, title, img, text, price) => {
  const formattedPrice = price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  return `
    <div class="col"> 
      <div class="card" style="background-color: rgba(11, 11, 11, 0.5);">       
        <a class"card-link" href="../item/item.html?id=${id}">
          <img src="${img}" alt="" class="card-img">
        </a>
        <div class="card-body">
          <a class="card-link text-decoration-none text-white" href="../item/item.html?id=${id}"">
            <h5 class="card-title text-truncate" >${title}</h5>
            <p class="card-text-description text-secondary">${text}</p>
          </a>
        </div>
        <div class="card-footer">
          <div class="d-flex ms-auto align-items-center">
            <div class="col">
            <input type="hidden" class="hiddenPrice" value="${price}">
              <p class="price">
                ${formattedPrice}
              </p>
            </div>
            <div class="col">
              <input type="number" class="form-control" min="1" max="5" placeholder="1" step="1" value="1"></input>
            </div>
              <button class="btn btn-add">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>            
              </button>
          </div>
        </div>
      </div>
    </div>
  `;
};
