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

  static async getCartByUserId(userId) {
    const cart = await Cart.findOne({ User: userId }).populate({path: 'items.product', select: 'name _id description'});
    return cart;
  }
  
  static async updateCartItems(userId, itemsToUpdate) {
    let cart = await Cart.findOne({ User: userId });
  
    if (!cart) {
      // Si no existe el carrito, podrías elegir crear uno nuevo o lanzar un error
      throw new Error('Cart not found.');
    } else {
      // Actualiza o añade los ítems proporcionados
      itemsToUpdate.forEach((itemToUpdate) => {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === itemToUpdate.product);
        if (itemIndex > -1) {
          // Actualiza la cantidad si el producto ya existe en el carrito
          cart.items[itemIndex].quantity = itemToUpdate.quantity;
        } else {
          // Añade el producto al carrito si no existe
          cart.items.push(itemToUpdate);
        }
      });
    }
  
    await cart.save();
    return cart;
  }
  
  static async removeItemFromCart(userId, productId) {
    const cart = await Cart.findOne({ User: userId });
    if (!cart || cart.items.length === 0) {
      throw new Error('The cart is empty or not found.');
    }
    
    // Encuentra el índice del ítem en el carrito que coincide con el productId
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    // Si se encuentra el ítem, elimínalo del arreglo
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return cart.populate({path: 'items.product', select: 'name _id description'}); // Devuelve el carrito actualizado
    } else {
      throw new Error('Product not found in cart.'); // Maneja el caso en que el producto no se encuentra
    }
  }
}

export { Cart }