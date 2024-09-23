import { buildNavBar } from "./public/components/navbar.js";
import express from 'express'
import { readFile, writeFile } from 'fs/promises' 

import clientesRouter from './routes/clientes.routes.js'
import pedidosRouter from './routes/pedidos.routes.js'
import productosRouter from './routes/productos.routes.js'

const app = express()
const port = 5000

app.use(express.json());
app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})

app.use(express.static('./public'))
app.use('/clientes', clientesRouter)
app.use('/pedidos', pedidosRouter)
app.use('/productos', productosRouter)
