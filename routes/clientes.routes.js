import { Router } from "express";
import { readFile, writeFile } from 'fs/promises' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const fileClientes = await readFile('./data/clientes.json', "utf-8")
const ClientesData = JSON.parse(fileClientes)
const router = Router()

const SECRET = "YyY81_2ECKZQfUO9nPVdWzVWFU359mLMNeIx2-gSvpZNj-NlfiEZ-fNxNmhMFTuH"

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

  const result = ClientesData.find(e => e.email === email)

  if (!result) {
    return res.status(404).send({ status: false });
  }

  const controlPass = bcrypt.compareSync(pass, result.pass)

  if (!controlPass) {
    return res.status(404).send({ status: false });
  }

  const token = jwt.sign({ ...result }, SECRET, { expiresIn: 5 })
  
  res.status(200).json(token)
})

router.post('/create',(req,res)=>{
    const {nombre,telefono,email,password} = req.body
    

    try{
        const hashedPass = bcrypt.hashSync(password, 8);

        console.log(hashedPass)

        const id =  ClientesData.length > 0 ? ClientesData[ClientesData.length-1].id + 1 : 1

        ClientesData.push({id, nombre, telefono, email,  pass:hashedPass})

        writeFile('./data/clientes.json', JSON.stringify(ClientesData,null,2))

        res.status(200).json({status:true})

    }catch(error){
        console.log(error)
        res.status(400).json({status:false})
    }
})

export default router