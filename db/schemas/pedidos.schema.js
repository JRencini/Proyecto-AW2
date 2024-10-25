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

/*
{
  "cliente": "671a8e50e7c2861cdc647b1d",
  "fecha": "2024-10-25T20:21:30.958Z",
  "cuerpo": [
          {
            "producto": "671bb7fb903dd7169fad2838",
            "cantidad": "1",
            "observaciones": ""
          }],
  "total": 1600
}*/