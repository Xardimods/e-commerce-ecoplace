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
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Cart = mongoose.model('Cart', cartSchema);

export class CartModel {
  static async addItemToCart(userId, items) {
    let cart = await Cart.findOne({ User: userId });
    if (!cart) {
      // No hay carrito, crea uno nuevo
      cart = new Cart({
        User: userId,
        items: [] // Inicializa los ítems vacíos para añadirlos más tarde
      });
    }

    for (const item of items) {
      const productIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === item.product);
      if (productIndex > -1) {
        // El producto ya existe, actualiza la cantidad
        cart.items[productIndex].quantity += item.quantity;
      } else {
        // Añade el nuevo producto al carrito
        cart.items.push(item);
      }
    }

    await cart.save();
    return cart.populate({path: 'items.product', select: 'name _id description'});
  }
}

export { Cart }