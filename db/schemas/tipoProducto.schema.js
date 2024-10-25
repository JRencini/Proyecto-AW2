import mongoose from 'mongoose';

const { Schema, models, model, ObjectId} = mongoose;

const TipoProductoSchema  = new Schema({
  codigo: { type: String, required: true, unique: true},
  nombre: { type: String, required: true},
  descripcion: { type: String},

})

const TipoProducto = models.tipoProducto || model('tipoProducto', TipoProductoSchema)

export default TipoProducto