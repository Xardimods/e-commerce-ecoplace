const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  User: { 
  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { 
	type: mongoose.Schema.Types.ObjectId, 
	ref: 'Product', 
	required: true },
    quantity: { 
	type: Number, 
	required: true, 
	default: 1 }
  }],
  createdAt: { 
  type: Date, 
  default: Date.now },
});

cartSchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

cartSchema.set("toJSON", {
  virtuals: true,
});

exports.Cart = mongoose.model('Cart', cartSchema);