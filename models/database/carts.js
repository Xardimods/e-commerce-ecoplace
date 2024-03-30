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

const Cart = mongoose.model('Cart', cartSchema);

export { Cart }

export class CartModel {
  static async addItemToCart(userId, { productId, quantity }) {
    try {
      let cart = await Cart.findOne({ User: userId });
      if (!cart) {
        cart = await Cart.create({ User: userId, items: [] });
      }
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        // Producto ya en el carrito, actualizar cantidad
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Agregar nuevo producto al carrito
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error updating the cart: ' + error.message);
    }
  }
}