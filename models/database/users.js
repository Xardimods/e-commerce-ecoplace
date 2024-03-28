import mongoose from 'mongoose';
import validator from 'validator'
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('¡Correo electrónico inválido!')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLenght: [8, 'La contraseña debe tener un mínimo de 8 caracteres'],
    validate(value) {
      if (value.includes('12345678')) {
        throw new Error('¡Contraseña Insegura!')
      }
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  zip: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "seller", "admin"],
  },
  insights: [
    // aqui agregaremos en base a nuestra necesidad
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
});

const User = mongoose.model("User", userSchema);

export class UserModel {

  // static async generateAuthToken(user) {
  //   const user = this.user
  //   const token = jwt.sign({
  //     email: user.email.toString()
  //   }, process.env.JWT_SECRET_KEY);
  //   user.tokens = user.tokens.concat({ token })

  //   await user.save()

  //   return token;
  // }

  static async getUser() { }

  static async createUser(user) {

    if (!user.password) {
      throw new Error('¡Se requiere una contraseña!');
    }

    try {
      const salt = await bycrypt.genSalt(10);

      user.password = await bycrypt.hash(user.password, salt);

      const createdUser = await User.create(user);
      return createdUser;
    } catch (error) {
      res.status(500).json({ message: "There was an error!", error });
    }
  }

  static async updateUser() { }

  static async deleteUser() { }

  static async logInUser() { }

  static async logOutUser() { }

  static async logAuthAllUser() { }
}
