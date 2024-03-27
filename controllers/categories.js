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
    const category = req.body;
    const {newCategory, isExisting} = await CategoriesModel.createCategory({ input: category });

    if (isExisting) {
      return res.status(409).json({message: 'Category already exists', category: newCategory})
    }

    res.status(201).json(newCategory);
  }

  static async updateCategory(req, res) {
    const categorie = req.body;
    const { id } = req.params

    const { conflict, updatedCategory, existingCategory } = await CategoriesModel.updateCategory({ id, input: categorie });

    // Si hay un conflicto, envía un mensaje indicándolo
    if (conflict) {
      return res.status(409).json({
        message: "A category with the given name already exists.",
        existingCategoryName: existingCategory.categoryName,
        existingCategoryId: existingCategory._id,
      });
    }

    // Si la categoría se actualizó correctamente
    if (updatedCategory) {
      return res.json({ message: 'Category Updated', category: updatedCategory });
    } else {
      // Si el ID proporcionado no corresponde a ninguna categoría existente
      return res.status(404).json({ message: 'Category not found' });
    }
  }

  static async deleteCategory(req, res) {
    const { id } = req.params
    const deletedCategory = await CategoriesModel.deleteCategory({ id })
    res.json({ message: 'Category Deleted' })
  }
}