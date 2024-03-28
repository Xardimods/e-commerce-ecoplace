import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

exports.Cart = mongoose.model('Cart', cartSchema);