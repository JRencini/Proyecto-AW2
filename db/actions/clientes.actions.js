import { connectToDatabase } from "../connection.js"
import Cliente from "../schemas/clientes.schema.js";
import bcrypt from 'bcryptjs'

export const createCliente = async ({nombre, telefono, email, password}) => {
  try {
    await connectToDatabase();
    const res = await Cliente.create({nombre, telefono, email, password});
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error('Error al crear el cliente en MongoDB:', error);
    throw error;
  }
};

export const authenticateCliente = async (email, password) => {
  try {
    await connectToDatabase();
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return { success: false, message: "Cliente no encontrado" };
    }
    const isPasswordValid = bcrypt.compareSync(password, cliente.password);

    if (!isPasswordValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }
    return { success: true, cliente };
  } catch (error) {
    console.error('Error al autenticar el cliente:', error);
    return { success: false, message: "Error en el servidor" };
  }
};
