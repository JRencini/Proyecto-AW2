import express from 'express'
import 'dotenv/config'

import clientesRouter from './routes/clientes.routes.js'
import pedidosRouter from './routes/pedidos.routes.js'
import productosRouter from './routes/productos.routes.js'
import tipoProductoRouter from './routes/tipoProducto.routes.js'

const app = express()
const port = process.env.PORT

app.use(express.static('public'));
app.use(express.json());
app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})

app.use(express.static('./public'))
app.use('/clientes', clientesRouter)
app.use('/pedidos', pedidosRouter)
app.use('/productos', productosRouter)
app.use('/tipoProducto', tipoProductoRouter)