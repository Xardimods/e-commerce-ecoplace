import mongoose from 'mongoose';
import { Product } from '../database/products.js';

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
    },
    price: {
      type: Number,
      default: 0
    },
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
    cart = new Cart({ User: userId, items: [] });
  }

  for (const item of items) {
    // Busca el producto para obtener información actualizada, como el precio
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }

    const productIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === item.product);
      if (productIndex > -1) {
        // El producto ya existe en el carrito, actualiza la cantidad
        cart.items[productIndex].quantity += item.quantity;
      } else {
        // Añade el nuevo producto al carrito, incluyendo el precio actualizado
        cart.items.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price // Usa el precio actual del producto
        });
      }
    }

    await cart.save();
    // Poblamos la información del producto para la respuesta
    return cart.populate({ path: 'items.product', select: 'name _id description price' });
  }

  static async getCartByUserId(userId) {
    try {
      // Recuperar el carrito y poblar los datos del producto
      let cart = await Cart.findOne({ User: userId })
        .populate({path: 'items.product', select: 'name brand price images description'});
  
      if (!cart) {
        return { message: 'The cart is empty.' };
      }
  
      // Calcular el total del carrito basado en los precios actuales de los productos
      let total = 0;
      cart.items.forEach(item => {
        total += item.quantity * item.product.price;
      });
  
      // Convertir el documento del carrito a un objeto JavaScript para modificarlo
      cart = cart.toObject();
      
      // Añadir el total calculado y el subtotal por ítem al objeto del carrito
      cart.total = total;
      cart.items.forEach(item => {
        item.subtotal = item.quantity * item.product.price;
      });
  
      return cart;
      } catch (error) {
        throw new Error('Error getting cart: ' + error.message);
      }
  }
  
  static async updateCartItems(userId, itemsToUpdate) {
    let cart = await Cart.findOne({ User: userId });
  
    if (!cart) {
      throw new Error('Cart not found.');
    } else {
      for (const itemToUpdate of itemsToUpdate) {
        const product = await Product.findById(itemToUpdate.product);
        if (!product) {
          throw new Error(`Product with ID ${itemToUpdate.product} not found`);
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === itemToUpdate.product);
        if (itemIndex > -1) {
          // Actualiza la cantidad y el precio si el producto ya existe en el carrito
          cart.items[itemIndex].quantity = itemToUpdate.quantity;
          cart.items[itemIndex].price = product.price; // Actualiza el precio al precio actual del producto
        } else {
          // Añade el producto al carrito si no existe, incluyendo el precio actual
          cart.items.push({
            product: itemToUpdate.product,
            quantity: itemToUpdate.quantity,
            price: product.price
          });
        }
      }
    }
  
    await cart.save();
    // Considera poblar los datos del producto para la respuesta, similar a cuando añades ítems
    return cart.populate({path: 'items.product', select: 'name _id description price'});
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