import { getSession } from "../../utils/sessionStorage.controller.js";
import { cardComponent } from "../../components/card.js";

const user = getSession('user');
const txtNombre = document.getElementById('txtNombre');
const btnLogout = document.getElementById('btnLogout')
txtNombre.textContent = `Hola ${user.name}`;

const logout = (key) => {
  sessionStorage.removeItem(key)
}

const loadCategories = async () => {
  try {
    const response = await fetch('/tipoProducto/obtenerTiposProducto');
    const categories = await response.json();

    const listCategories = document.getElementById('listCategories');
    listCategories.innerHTML = '';

    categories.forEach(category => {
      const option = document.createElement('button');
      option.classList.add('dropdown-item');
      option.textContent = category.nombre;
      option.dataset.codigo = category.codigo; 
      option.addEventListener('click', () => filterByCategory(category.codigo, category.nombre));
      listCategories.appendChild(option);
    });

    const clearFilterOption = document.createElement('button');
    clearFilterOption.classList.add('dropdown-item', 'text-danger');
    clearFilterOption.textContent = 'Quitar filtros';
    clearFilterOption.addEventListener('click', () => loadProducts());
    listCategories.appendChild(clearFilterOption);

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
};

document.getElementById('btnLogout').addEventListener('click', () => {
      logout('user');
      window.location.href = '../login/login.html';
    });

const loadProducts = async () => {
  try {
    const response = await fetch('/productos/obtenerProductos');
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
};

const renderProducts = (products) => {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';

  products.forEach((product, index) => {
    if (index % 5 === 0) {
      const row = document.createElement('div');
      row.classList.add('row', 'mb-4', 'flex', 'justify-between');
      cardsContainer.appendChild(row);
    }

    const card = cardComponent({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen
    });

    const lastRow = cardsContainer.lastElementChild;
    lastRow.appendChild(card);
  });
};

const filterByCategory = async (categoryCode, categoryName) => {
  try {
    const response = await fetch(`/productos/obtenerProductosPorCategoria/${categoryCode}`);
    
    if (response.ok) {
      const filteredProducts = await response.json();
      renderProducts(filteredProducts);
      const dropdownButton = document.getElementById('dropdownMenuButton');
      dropdownButton.textContent = `Categoría: ${categoryName}`;
    } else {
      console.error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al filtrar los productos:", error);
  }
};

window.onload = () => {
  loadCategories();
  loadProducts(); 
};
