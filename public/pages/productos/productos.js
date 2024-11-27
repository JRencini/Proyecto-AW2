import { getSession } from "../../utils/sessionStorage.controller.js";
import { fetchTiposProducto } from "../../api/tipoProducto.js";
import { fetchProductos, eliminarProducto, actualizarProducto, crearProducto, actualizarDisponibilidadProducto } from "../../api/productos.js";
import { productFormComponent } from "../../components/productForm.js";
import { addProductFormComponent } from "../../components/addProductForm.js";

const user = getSession('user');
const userData = user.clienteData;

const txtNombre = document.getElementById('txtNombre');
const btnLogout = document.getElementById('btnLogout');
const btnAddProduct = document.getElementById('btnAddProduct');
const searchProduct = document.getElementById('searchProduct');
const filterType = document.getElementById('filterType');
const productTableBody = document.getElementById('productTableBody');

txtNombre.textContent = `Hola ${userData.nombre}`;

// Logout
const logout = (key) => {
  sessionStorage.removeItem(key);
  window.location.href = '../login/login.html';
};

btnLogout.addEventListener('click', () => {
  logout('user');
});

// Cargar categorías
const loadCategories = async () => {
  try {
    const categories = await fetchTiposProducto();
    filterType.innerHTML = '<option value="">Filtrar por tipo</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category._id;
      option.textContent = category.nombre;
      filterType.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
};

// Cargar productos
const loadProducts = async (filter = {}, search = '') => {
  try {
    const { categoria = null, disponibles = false } = filter;

    // Usar la función unificada fetchProductos
    let products = await fetchProductos(disponibles, categoria);

    // Filtrar por texto si se proporciona
    if (search) {
      products = products.filter(product => 
        product.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (!products.length) {
      console.warn('No hay productos que mostrar.');
      renderProducts([]);
      return;
    }

    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
};

// Renderizar productos
const renderProducts = (productos) => {
  productTableBody.innerHTML = '';

  productos.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.nombre}</td>
      <td>${product.descripcion}</td>
      <td>
        <input type="checkbox" class="form-check-input" ${product.disponible ? 'checked' : ''} data-id="${product._id}">
      </td>
      <td>
        <button class="btn btn-sm btn-secondary" data-id="${product._id}" title="Modificar">
          ...
        </button>
        <button class="btn btn-sm btn-danger" data-id="${product._id}" title="Dar de baja">
          ...
        </button>
      </td>
    `;

    // Checkbox de disponibilidad
    row.querySelector('.form-check-input').addEventListener('change', async () => {
      try {
        await actualizarDisponibilidadProducto(product._id);
        loadProducts();
      } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
      }
    });

    // Botón Modificar
    row.querySelector('.btn-secondary').addEventListener('click', () => {
      productFormComponent({
        id: product._id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagenId: product.imagenId,
        onSave: async ({ formData }) => {
          try {
            formData.append('id', product._id);
            await actualizarProducto(formData);
            loadProducts();
          } catch (error) {
            console.error("Error al modificar el producto:", error);
          }
        },
        isEdit: true
      });
    });

    // Botón Eliminar
    row.querySelector('.btn-danger').addEventListener('click', async () => {
      if (confirm(`¿Estás seguro de que quieres eliminar el producto ${product.nombre}?`)) {
        try {
          await eliminarProducto(product._id);
          loadProducts();
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
        }
      }
    });

    productTableBody.appendChild(row);
  });
};

// Formulario para agregar producto
btnAddProduct.addEventListener('click', () => {
  addProductFormComponent({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    imagenId: '',
    onSave: async ({ formData }) => {
      try {
        const response = await crearProducto(formData);
        await loadProducts();
      } catch (error) {
        console.error("Error al agregar el producto:", error.message);
      }
    },
    isEdit: false
  });
});

// Filtros y búsqueda
searchProduct.addEventListener('input', () => {
  loadProducts({}, searchProduct.value);
});

filterType.addEventListener('change', () => {
  const categoryFilter = filterType.value ? { categoria: filterType.value } : {};
  loadProducts(categoryFilter, searchProduct.value);
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (userData.role === 'admin') {
    btnAddProduct.classList.remove('d-none');
  }
  loadCategories();
  loadProducts();
});
