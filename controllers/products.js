import { ProductsModel } from "../models/database/products.js";

export class ProductsController {
  static async getAll(req, res) {
    const products = await ProductsModel.getAll();
    res.json(products);
  }

  static async createProduct(req, res) {
    const product = req.body;
    const newProduct = await ProductsModel.createProduct({ input: product });
    res.status(201).json(newProduct);
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
    res.json({ message: 'Product Updated' })
  }

  static async deleteProduct(req, res) {
    const { id } = req.params
    const deletedProduct = await ProductsModel.deletedProduct({ id })
    res.json({ message: 'Product Deleted' })
  }
}


