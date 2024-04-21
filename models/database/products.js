import mongoose from 'mongoose';
import { bucket } from '../config/firebase-config.js'

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
    return await Product.find().populate({ path: 'categories', select: 'categoryName' }).populate('seller', 'name lastname');
  }

  static async getAllProductsBySeller(id) {
    try {
      const products = await Product.find({ seller: id }).populate({ path: 'categories', select: 'categoryName' });
      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getById({ id }) {
    return await Product.findById(id).populate({ path: 'categories', select: 'categoryName -_id' });
  }

  static async getFilteredProducts({ name, categories, minPrice, maxPrice }) {

    // Inicializa un objeto vacío para construir la consulta

    let query = {};

    // Agrega cada condición si su parámetro correspondiente está presente
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (categories) {
      query.categories = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    if (minPrice !== undefined) {
      query.price = { ...query.price, $gte: minPrice };
    }

    if (maxPrice !== undefined) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    // Realiza la búsqueda utilizando la consulta construida y popula las categorías
    return await Product.find(query)
      .populate({ path: 'categories', select: 'categoryName -_id' })
      .populate('seller', 'name')
      .select('name description price images');
  }

  static async createProduct({ input }) {
    const newProduct = await Product.create(input)
    return newProduct;
  }

  static async uploadImagesToFirebase(files) {
    if (!files || files.length === 0) {
      console.log("No files to upload to Firebase.");
      return [];
    }

    const uploadPromises = files.map(file => {
      const fileName = `productos/${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      return new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });

        blobStream.on('error', error => {
          console.error("Error uploading file to Firebase:", error);
          reject(error);
        });

        blobStream.on('finish', () => {
          // Asegúrate de que esta URL es accesible públicamente en la configuración de tu Firebase Storage
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
          console.log("File uploaded to Firebase successfully:", publicUrl);
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
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
