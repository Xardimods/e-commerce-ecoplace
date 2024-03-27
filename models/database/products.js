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
  image: {
    type: String,
    default: ''
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

productSchema.virtual('id').get(function () {  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
})

productSchema.set('toJSON', {
  virtuals: true,
})

const Product = mongoose.model('Product', productSchema)

export class ProductsModel {
  static async getAll() {
    return await Product.find().populate('categories');
  }

  static async getById({ id }) {
    return await Product.findById(id).populate('categories');
  }

  static async getFilteredProducts({ name, categories, minPrice, maxPrice }) {
    if (name) {
      return await Product.find({ name: { $regex: new RegExp(name, "i") } });
    }

    // if (categories) {
    //   return await Product.find({ categories: { $elemMatch: { categoryName: categories.toLowerCase() } } });
    // }

    if (minPrice) {
      return await Product.find({ price: { $lte: minPrice } })
    }

    if (maxPrice) {
      return await Product.find({ price: { $gte: maxPrice } })
    }

    return await Product.find({})
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
