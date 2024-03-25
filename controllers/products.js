const Product = require('../models/database/products')
const Category = require('../models/database/categories')

export class ProductController{

  static async getProducts (req, res) {
    try {
      const  products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static async createProduct (req, res) {
    try {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).send('Invalid Category')
      }
      
      const product = await Product.create(req.body)
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}