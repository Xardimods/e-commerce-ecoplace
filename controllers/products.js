import { ProductsModel } from "../models/database/products.js";
import { CategoriesModel } from "../models/database/categories.js";

export class ProductsController {
  static async getAll(req, res) {
    const products = await ProductsModel.getAll()
    res.json(products);
  }

  static async createProduct(req, res) {
    const productData = req.body;
    productData.seller = req.user._id;  // Añadir el ID del vendedor (usuario) a productData

    if (!Array.isArray(productData.categories) || !productData.categories.length) {
      return res.status(400).json({ message: "Invalid categories format" });
    }

    const categoryIds = productData.categories;

    const categories = await Promise.all(
      categoryIds.map(id => CategoriesModel.getById({ id }))
    );

    if (categories.some(category => !category)) {
      return res.status(400).json({ message: 'Invalid Category' })
    }

    try {
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
    const product = req.body;
    const { id } = req.params

    const updatedProduct = await ProductsModel.updateProduct({ id, input: product })
    res.json({ message: 'Product Updated', updatedProduct })
  }

  static async deleteProduct(req, res) {
    const { id } = req.params
    const deletedProduct = await ProductsModel.deletedProduct({ id })
    res.json({ message: 'Product Deleted', deletedProduct })
  }
}


