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


export default router