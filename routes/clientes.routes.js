import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createCliente, authenticateCliente, obtenerCliente } from "../db/actions/clientes.actions.js";
import Cliente from "../db/schemas/clientes.schema.js";

const router = Router();
const SECRET = process.env.SECRET;

router.get('/buscarPorID/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Cliente.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `No se encontró el cliente con el id: ${id}` });
    }
  } catch (error) {
    console.error('Error al buscar cliente por ID:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get('/buscarPorEmail/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await obtenerCliente(email);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `No se encontró el cliente con el email: ${email}` });
    }
  } catch (error) {
    console.error('Error al buscar cliente por email:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get('/obtenerNombre/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Cliente.findById(id, 'nombre');
    if (result) {
      res.status(200).json(result.nombre);
    } else {
      res.status(404).json({ message: `No se encontró el cliente con el id: ${id}` });
    }
  } catch (error) {
    console.error('Error al obtener nombre del cliente:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  try {
    const { success, cliente, message } = await authenticateCliente(email, password);

    if (!success) {
      return res.status(401).json({ message });
    }

    const token = jwt.sign({ id: cliente._id, email: cliente.email }, SECRET, { expiresIn: '5h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post('/nuevoCliente', async (req, res) => {
  const { nombre, telefono, email, pass } = req.body;
  if (!nombre || !telefono || !email || !pass) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }

  try {
    const hashedPass = bcrypt.hashSync(pass, 8);
    const result = await createCliente({ nombre, telefono, email, password: hashedPass });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
});

router.get('/info', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const cliente = await Cliente.findById(decoded.id);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono });
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
