import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export class CategoriesModel {
  static async getAll() {
    return await Category.find();   
  }

  static async getById({ id }) {
    return await Category.findById(id);
  }

  static async findByName(categoryName) {
    return await Category.findOne({ categoryName: { $regex: new RegExp(categoryName, 'i') } });
  }

  static async createCategory({ input }) {
    const existingCategory = await Category.findOne({
      categoryName: input.categoryName,
    });

    if (existingCategory) {
      return { existingCategory, isExisting: true };
    }
    const newCategory = await Category.create(input);
    return { newCategory, isExisting: false };
  }

  static async updateCategory({ id, input }) {
    // Verificar si ya existe otra categoría con el mismo nombre y diferente ID
    const existingCategory = await Category.findOne({
      categoryName: input.categoryName,
      _id: { $ne: id },
    });

    if (existingCategory) {
      // Retornar algo que indique que ya existe una categoría con ese nombre
      return { conflict: true, existingCategory };
    }

    // Si no hay conflicto, procede a actualizar la categoría
    const updatedCategory = await Category.findByIdAndUpdate(id, input, {
      new: true,
    });
    return { conflict: false, updatedCategory };
  }

  static async deleteCategory({ id }) {
    const deleteCategory = await Category.findByIdAndDelete(id);
    return deleteCategory ? true : false;
  }
}
