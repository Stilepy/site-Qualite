const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  email: { type: String },
  premium: { 
    isActive: { type: Boolean, default: false },
    plan: { type: String, enum: ['free', 'basic', 'epro', null], default: null },
    expiresAt: { type: Date },
    servers: [{
      id: { type: String, required: true },
      name: { type: String }
    }]
  },
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);