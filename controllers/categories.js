import { CategoriesModel } from "../models/database/categories.js";

export class CategoriesController{
  static async getAll(req, res) {
    const categories = await CategoriesModel.getAll();
    res.json(categories);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const category = await CategoriesModel.getById({ id });
    if (!category) res.status(404).json({ message: "Not found." });
    return res.json(category);
  }

  static async createCategory(req, res) {
    const categorie = req.body;
    const newCategory = await CategoriesModel.createCategory({ input: categorie });
    res.status(201).json(newCategory);
  }

  static async updateCategory(req, res) {
    const categorie = req.body;
    const { id } = req.params

    const updatedCategory = await ProductsModel.updateCategory({ id, input: categorie })
    res.json({ message: 'Category Updated' })
  }

  static async deleteCategory(req, res) {
    const { id } = req.params
    const deletedCategory = await CategoriesModel.deleteCategory({ id })
    res.json({ message: 'Category Deleted' })
  }
}