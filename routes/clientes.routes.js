import { Router } from "express";
import { readFile, writeFile } from 'fs/promises' 

const fileClientes = await readFile('./data/clientes.json', "utf-8")
const ClientesData = JSON.parse(fileClientes)

const router = Router()

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

router.post('/login', (req, res) => {
  const email = req.body.email
  const pass = req.body.password

  const result = ClientesData.find(e => e.email === email && e.password === pass)

  if (result) {
    const data = {
      id: result.id,
      name: result.nombre,
      email: result.email,
      status: true
    }
    res.status(200).json(data)
  } else {
    res.status(400).json({status:false})
  }
})

export default router