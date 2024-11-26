import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const ClientesSchema = new Schema({
  nombre: { type: String, required: true, minlength: 2, maxlength: 80 },
  telefono: { type: String },
  email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const Cliente = models.cliente || model('cliente', ClientesSchema);

export default Cliente;

