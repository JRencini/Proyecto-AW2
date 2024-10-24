import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const CuerpoSchema = new Schema({
  idProducto: { type: Number, required: true },
  cantidad: { type: Number, required: true },
  observaciones: { type: String, default: "" }
});

const PedidosSchema = new Schema({
  idCliente: { type: Number, required: true }, 
  fecha: { type: Date, required: true },
  cuerpo: { type: [CuerpoSchema], required: true }, 
  total: { type: Number, required: true }
});

const Pedido = models.pedido || model('pedido', PedidosSchema);

export default Pedido