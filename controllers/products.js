import mongoose from 'mongoose';
import { ProductsModel } from "../models/database/products.js";
import { CategoriesModel } from "../models/database/categories.js";
import { bucket } from '../models/config/firebase-config.js';

export class ProductsController {
  static async getAll(req, res) {
    const products = await ProductsModel.getAll()
    res.json(products);
  }

  static async createProduct(req, res) {
    try {
      let productData = req.body;
      productData.seller = req.user._id; // Añadir el ID del vendedor (usuario) a productData
  
      if (productData.categories) {
        const categoryIds = Array.isArray(productData.categories) ? productData.categories : [productData.categories];
        const validCategoryIds = categoryIds.filter(id => mongoose.Types.ObjectId.isValid(id));
  
        if (validCategoryIds.length !== categoryIds.length) {
          return res.status(400).json({ message: "One or more category IDs are invalid." });
        }
  
        const categories = await Promise.all(validCategoryIds.map(id => CategoriesModel.getById({ id })));
        
        // Verificar si todas las categorías existen
        if (categories.some(category => !category)) {
          return res.status(400).json({ message: 'One or more categories not found' });
        }
  
        // Actualizar productData.categories con los IDs válidos
        productData.categories = categories.map(category => category._id);
      }
      // Cargar imágenes a Firebase y obtener URLs si hay archivos de imagen
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = await ProductsModel.uploadImagesToFirebase(req.files);
      }
  
      // Añadir URLs de imágenes a los datos del producto
      productData.images = imageUrls;
  
      // Crear el producto en la base de datos
      const newProduct = await ProductsModel.createProduct({ input: productData });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    const product = await ProductsModel.getById({ id });
    if (!product) res.status(404).json({ message: "Not found." });
    return res.json(product);
  }

  static async getFilteredProducts(req, res) {
    const { name, categories, minPrice, maxPrice } = req.query;
    const filteredProducts = await ProductsModel.getFilteredProducts({ name, categories, minPrice, maxPrice });
    res.json(filteredProducts);
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, categories, countInStock, rating, numReviews, isFeatured, brand } = req.body;
  
      // Obtén el producto actual para preservar las imágenes existentes si es necesario
      const currentProduct = await ProductsModel.getById({ id });
      if (!currentProduct) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      let imagesToUpdate = currentProduct.images;
      // Si hay nuevas imágenes para subir, reemplaza el array de imágenes existente
      if (req.files && req.files.length > 0) {
        const imageUrls = await uploadImagesToFirebase(req.files);
        imagesToUpdate = imageUrls;
      }
  
      const updatedProductData = {
        name,
        description,
        brand,
        price,
        categories,
        images: imagesToUpdate,
        countInStock,
        rating,
        numReviews,
        isFeatured,
        dateUpdated: new Date() // Actualizar la fecha de actualización
      };
  
      const updatedProduct = await ProductsModel.updateProduct({ id, input: updatedProductData });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Unable to update product." });
      }
  
      res.json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductsModel.getById({ id });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      // Elimina las imágenes asociadas en Firebase Storage
      const deleteImagePromises = product.images.map(imageUrl => {
        // Extrae el nombre del archivo de la URL
        const imageName = imageUrl.split('/').pop().split('?')[0];
        return bucket.file(imageName).delete();
      });
  
      await Promise.all(deleteImagePromises);
  
      // Elimina el producto de la base de datos
      const deletionResult = await ProductsModel.deletedProduct({ id });
  
      if (!deletionResult) {
        return res.status(404).json({ message: "Unable to delete product." });
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error: error.message });
    }
  }
}


