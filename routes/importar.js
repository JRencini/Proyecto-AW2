import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Cliente from '../db/schemas/clientes.schema.js';
import Cliente from './models/Cliente.js';  // Asegúrate de que la ruta sea correcta
import Producto from './models/Producto.js'; // Asegúrate de que la ruta sea correcta

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Función para importar datos
const importData = async (model, filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf-8'));
    await model.insertMany(data);
    console.log(`Datos importados exitosamente desde ${filePath}`);
  } catch (error) {
    console.error(`Error al importar datos desde ${filePath}:`, error);
  }
};

// Importar clientes
importData(Cliente, './data/clientes.json'); // Ruta al archivo JSON de clientes
// Importar productos
importData(Producto, './data/productos.json'); // Ruta al archivo JSON de productos
