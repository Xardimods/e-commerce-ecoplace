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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Role',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  bills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  }],
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

  static async generateAuthToken(user) {
    try {
      const token = jwt.sign({
        email: user.email.toString()
      }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
      user.tokens = user.tokens.concat({ token })

      return token;
    } catch (error) {
      console.error('Error al generar el token de autenticación:', error);
      throw new Error('Error al generar el token de autenticación');
    }
  }

  static async getUser() { }

  static async createUser(user) {

    if (!user.password) {
      throw new Error('¡Se requiere una contraseña!');
    }

    try {
      const salt = await bycrypt.genSalt(8);

      user.password = await bycrypt.hash(user.password, salt);

      const createdUser = await User.create(user);
      return createdUser;
    } catch (error) {
      throw new Error('There was an error!', error);
    }
  }

  static async updateUser() { }

  static async deleteUser() { }

  static async logInUser({ email, password }) {
    try {
      // Verify email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Credenciales incorrectas');
      }

      // Verify password
      const validateUserPassword = await bycrypt.compare(password, user.password);

      if (!validateUserPassword) {
        throw new Error('Credenciales incorrectas');
      }

      const token = await generateAuthToken(user);

      user.tokens.push({ token });
      await user.save();

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async logOutUser() { }

  static async logAuthAllUser() { }
}
