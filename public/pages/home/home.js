import { getSession } from "../../utils/sessionStorage.controller.js";
import { cardComponent } from "../../components/card.js";

const user = getSession('user');
const txtNombre = document.getElementById('txtNombre');
const btnLogout = document.getElementById('btnLogout')
let selectedCategoryButton = null;

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
      option.classList.add('btn', 'btn-category', 'me-2');  // Usamos la clase btn-category para el estilo personalizado
      option.textContent = category.nombre;
      option.dataset.codigo = category.codigo;

      // Manejar la selección de categorías
      option.addEventListener('click', () => {
        if (selectedCategoryButton) {
          selectedCategoryButton.classList.remove('selected');
        }
        option.classList.add('selected');  // Añadir la clase 'selected' al botón seleccionado
        selectedCategoryButton = option;

        filterByCategory(category.codigo, category.nombre);
      });

      listCategories.appendChild(option);
    });

    const clearFilterOption = document.createElement('button');
    clearFilterOption.classList.add('btn', 'btn-clear-filters', 'me-2');
    clearFilterOption.textContent = 'Quitar filtros';

    clearFilterOption.addEventListener('click', () => {
      loadProducts(); 
      if (selectedCategoryButton) {
        selectedCategoryButton.classList.remove('selected'); 
        selectedCategoryButton = null;
      }
    });

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

  const row = document.createElement('div');
  row.classList.add('row', 'mb-4', 'flex', 'flex-wrap', 'justify-start', 'gap-4'); 
  cardsContainer.appendChild(row);

  products.forEach(product => {
    const card = cardComponent({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen
    });

    row.appendChild(card); 
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
