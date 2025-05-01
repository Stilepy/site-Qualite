const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true, enum: ['basic', 'epro'] },
  amount: { type: Number, required: true },
  method: { type: String, required: true, enum: ['mercadopago', 'pix', 'credit_card'] },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String, required: true },
  paymentLink: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);