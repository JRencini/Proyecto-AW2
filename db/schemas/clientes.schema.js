import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const ClientesSchema = new Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Cliente = models.cliente || model('cliente', ClientesSchema);

export default Cliente;