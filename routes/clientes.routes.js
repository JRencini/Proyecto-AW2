import { Router } from "express";
import { readFile, writeFile } from 'fs/promises' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createCliente, authenticateCliente } from "../db/actions/clientes.actions.js";
import Cliente from "../db/schemas/clientes.schema.js";


const fileClientes = await readFile('./data/clientes.json', "utf-8")
const ClientesData = JSON.parse(fileClientes)
const router = Router()

const SECRET = process.env.SECRET

router.get('/buscarPorID/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const result = ClientesData.find(e => e.id === id)
   if(result){
      res.status(200).json(result)
    }else{
      res.status(400).json(`No se encontro el cliente con el id:${id}`)
    }
})

router.get('/buscarPorNombre/:nombre', (req, res)=>{
  const nombre = req.params.nombre
  const result = ClientesData.find(e => e.nombre === nombre)

  if(result){
      res.status(200).json(result)
  }else{
      res.status(400).json(`No se encontro el cliente con el nombre: ${nombre}`)
  }
})

router.get('/obtenerNombre/:id', (req, res)=>{
  const id = parseInt(req.params.id)

  const result = ClientesData.find(e => e.id === id)
   if(result){
      res.status(200).json(result.nombre)
    }else{
      res.status(400).json(`No se encontro el cliente con el id:${id}`)
    }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  try {
    const { success, cliente, message } = await authenticateCliente(email, password);

    if (!success) {
      return res.status(404).json({ message });
    }
    const token = jwt.sign({ id: cliente._id, email: cliente.email }, SECRET, { expiresIn: '5h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post('/create', async (req,res)=>{
  const {nombre,telefono,email,pass} = req.body
  if (!nombre || !telefono || !email || !pass) {
    return res.status(400).json({ message: "Todos los campos del producto son obligatorios" });
  }

  try{
    const hashedPass = bcrypt.hashSync(pass, 8);
    const result = await createCliente({nombre, telefono, email,  password:hashedPass})
    res.status(200).json(result)
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
})

router.get('/info', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

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

export default router