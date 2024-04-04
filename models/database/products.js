import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
})

const Product = mongoose.model('Product', productSchema)

export { Product }

export class ProductsModel {
  static async getAll() {
    return await Product.find().populate({ path: 'categories', select: 'categoryName' });
  }

  static async getById({ id }) {
    return await Product.findById(id).populate({ path: 'categories', select: 'categoryName -_id' });
  }

  static async getFilteredProducts({ name, categories, minPrice, maxPrice }) {
    // if (name) {
    //   return await Product.find({ name: { $regex: new RegExp(name, "i") } }).populate({ path: 'categories', select: 'categoryName _id' });;
    // }

    // if (categories) {
    //   return await Product.find({ categories: { $in: [categories] } }).populate({ path: 'categories', select: 'categoryName _id' });
    // }

    // if (minPrice) {
    //   return await Product.find({ price: { $lte: minPrice } }).populate({ path: 'categories', select: 'categoryName _id' });
    // }

    // if (maxPrice) {
    //   return await Product.find({ price: { $gte: maxPrice } }).populate({ path: 'categories', select: 'categoryName _id' });
    // }

    // return await Product.find({}).populate({ path: 'categories', select: 'categoryName _id' });

    // Inicializa un objeto vacío para construir la consulta

    let query = {};

    // Agrega cada condición si su parámetro correspondiente está presente
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (categories) {
      query.categories = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    if (minPrice) {
      query.price = { $lte: minPrice };
    }

    if (maxPrice) {
      // Si ya hay una condición de precio (minPrice), combina las condiciones usando $and
      if (query.price) {
        query.price.$gte = maxPrice;
      } else {
        query.price = { $gte: maxPrice };
      }
    }

    // Realiza la búsqueda utilizando la consulta construida y popula las categorías
    return await Product.find(query).populate({ path: 'categories', select: 'categoryName _id' });

  }

  static async createProduct({ input }) {
    const newProduct = await Product.create(input)
    return newProduct;
  }

  static async updateProduct({ id, input }) {
    const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true })

    return updatedProduct ? updatedProduct : false
  }

  static async deletedProduct({ id }) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
