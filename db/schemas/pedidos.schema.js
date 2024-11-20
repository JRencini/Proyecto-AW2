import mongoose from 'mongoose';

const { Schema, models, model, ObjectId } = mongoose;

const CuerpoSchema = new Schema({
  producto: { type: ObjectId, required: true, ref:'productos'},
  cantidad: { type: Number, required: true },
  observaciones: { type: String, default: "" }
});

const PedidosSchema = new Schema({
  cliente: { type: ObjectId, required: true, ref:'clientes'}, 
  fecha: { type: Date, required: true },
  cuerpo: { type: [CuerpoSchema], required: true }, 
  total: { type: Number, required: true }
});

const Pedido = models.pedido || model('pedido', PedidosSchema);

export default Pedido
