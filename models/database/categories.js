import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

categorySchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

const Category = mongoose.model("Category", categorySchema);

export class CategoriesModel{
  static async getAll() {
    return await Category.find();
  }

  static async getById({ id }) {
    return await Category.findById(id)
  }

  static async createCategory({ input }) {
    const newCategory = await Category.create(input)
    return newCategory;
  }

  static async updateCategory({ id, input }) {
    const updatedCategory = await Category.findByIdAndUpdate(id, input, { new: true })

    return updatedCategory ? updatedCategory : false
  }

  static async deletedCategory({ id }) {
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      return deletedCategory ? true : false;
    } catch (error) {
      throw error;
    }
  }

}
