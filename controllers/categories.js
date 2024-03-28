import { CategoriesModel } from "../models/database/categories.js";

export class CategoriesController{
  static async getAll(req, res) {
    try {
      const categories = await CategoriesModel.getAll();
      res.json(categories);
    } catch (error) {
      res.status(404).json({ message: "Not found." });
    }    
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoriesModel.getById({ id });
      return res.json(category);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async findCategoryByName(req, res) {
    try {
      const categoryName = req.params.name; 
      const category = await CategoriesModel.findByName(categoryName);
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error finding the category", error: error.message });
    }
  }

  static async createCategory(req, res) {
    const category = req.body;
    try {
      const {newCategory, isExisting} = await CategoriesModel.createCategory({ input: category });

      if (isExisting) {
        return res.status(409).json({message: 'Category already exists', category: newCategory})
      }

      res.status(201).json(newCategory);
    } catch (error) {
      return res.status(500).json({message: 'Error creating category', error: error.message})
    }
    
  }

  static async updateCategory(req, res) {
    const categorie = req.body;
    const { id } = req.params

    try {
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
    } catch (error) {
      return res.status(500).json({message: 'Error updating category', error: error.message})
    }    
  }

  static async deleteCategory(req, res) {
    const { id } = req.params

    try {
      const deletedCategory = await CategoriesModel.deletedCategory({ id })
      res.json({ message: 'Category Deleted', deletedCategory })
    } catch (error) {
      return res.status(500).json({message: 'Error deleting category', error: error.message})
    }    
  }
}