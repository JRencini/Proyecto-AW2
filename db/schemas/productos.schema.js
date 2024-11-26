import mongoose from 'mongoose';

const { Schema, models, model, ObjectId } = mongoose;

const ProductosSchema = new Schema({
  nombre: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
  descripcion: { type: String, maxlength: 500 }, 
  precio: { type: Number, required: true },
  imagenId: { type: ObjectId, ref: 'uploads.files' }, 
  tipoProducto: { type: ObjectId, required: true, ref: "tipoProducto" },
  disponible: { type: Boolean, default: true }
});

const Producto = models.producto || model('producto', ProductosSchema);

export default Producto;
