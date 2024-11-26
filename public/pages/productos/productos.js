import { getSession } from "../../utils/sessionStorage.controller.js";
import { fetchTiposProducto } from "../../api/tipoProducto.js";
import { fetchProductosPorCategoria, fetchProductos, eliminarProducto, actualizarProducto, crearProducto} from "../../api/productos.js";
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

const loadProducts = async (filter = {}, search = '') => {
  try {
    const categoryCode = filter.categoria || '';
    let products;
    if (categoryCode) {
      products = await fetchProductosPorCategoria(categoryCode);
    } else {
      products = await fetchProductos(); 
    }

    if (search) {
      products = products.filter(product => product.nombre.toLowerCase().includes(search.toLowerCase()));
    }
    
    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
};

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-danger" data-id="${product._id}" title="Dar de baja">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>
      </td>
    `;

    // Checkbox de disponibilidad
    row.querySelector('.form-check-input').addEventListener('change', async (event) => {
      const disponible = event.target.checked;
      try {
        await actualizarProducto(product._id, { disponible });
        loadProducts();
      } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
      }
    });

    // Acción Modificar
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

    // Acción Dar de Baja
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


searchProduct.addEventListener('input', () => {
  loadProducts({}, searchProduct.value);
});

filterType.addEventListener('change', () => {
  const categoryFilter = filterType.value ? { categoria: filterType.value } : {};
  loadProducts(categoryFilter, searchProduct.value);
});

document.addEventListener('DOMContentLoaded', () => {
  if (userData.role === 'admin') {
    btnAddProduct.classList.remove('d-none');
  }
  loadCategories();
  loadProducts();
});
