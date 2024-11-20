import mongoose from 'mongoose';

const { Schema, models, model, ObjectId } = mongoose;

const ProductosSchema = new Schema({
  nombre: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
  descripcion: { type: String, required: true, maxlength: 500 },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true },
  tipoProducto: { type: ObjectId, required: true, ref:"tipoProducto" }
});

const Producto = models.producto || model('producto', ProductosSchema);

export default Producto;
