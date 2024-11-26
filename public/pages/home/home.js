import { getSession } from "../../utils/sessionStorage.controller.js";
import { cardComponent } from "../../components/card.js";
import { fetchTiposProducto } from "../../api/tipoProducto.js";
import { fetchProductos, fetchProductosPorCategoria } from "../../api/productos.js";

const user = getSession('user');
const userData = user.clienteData;
const txtNombre = document.getElementById('txtNombre');
const btnLogout = document.getElementById('btnLogout');
const btnAddProduct = document.getElementById('btnAddProduct');
let selectedCategoryButton = null;

txtNombre.textContent = `Hola ${userData.nombre}`;

const logout = (key) => {
  sessionStorage.removeItem(key);
  window.location.href = '../login/login.html';
};

btnLogout.addEventListener('click', () => {
  logout('user');
});

const loadCategories = async () => {
  try {
    const categories = await fetchTiposProducto();
    const listCategories = document.getElementById('listCategories');
    listCategories.innerHTML = '';

    categories.forEach(category => {
      const option = document.createElement('button');
      option.classList.add('btn', 'btn-category', 'me-2');
      option.textContent = category.nombre;
      option.dataset.codigo = category._id;

      option.addEventListener('click', () => {
        if (selectedCategoryButton) {
          selectedCategoryButton.classList.remove('selected');
        }
        option.classList.add('selected');
        selectedCategoryButton = option;

        filterByCategory(category._id);
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
    alert('Error al cargar las categorías');
  }
};

const loadProducts = async () => {
  try {
    const products = await fetchProductos();
    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    alert('Error al cargar los productos');
  }
};

const renderProducts = (productos) => {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';

  const row = document.createElement('div');
  row.classList.add('row', 'mb-4', 'flex', 'flex-wrap', 'justify-start', 'gap-4');
  cardsContainer.appendChild(row);

  productos.forEach(product => {
    const card = cardComponent({
      id: String(product._id),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagenId: product.imagenId
    });
    row.appendChild(card);
  });
};


const filterByCategory = async (categoryCode) => {
  try {
    const filteredProducts = await fetchProductosPorCategoria(categoryCode);
    renderProducts(filteredProducts);
  } catch (error) {
    console.error("Error al filtrar los productos:", error);
    alert('Error al filtrar los productos');
  }
};

window.onload = () => {
  if (userData.role === 'admin') {
    btnAddProduct.classList.remove('d-none');
    btnAddProduct.addEventListener('click', function() {
      window.location.href = '../productos/productos.html';
    });
  }
  loadCategories();
  loadProducts();
};
