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

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password; // Eliminar la contraseña del objeto que se devuelve
  delete userObject.tokens; // Eliminar tokens para no enviarlos al cliente

  return userObject;
}

const User = mongoose.model("User", userSchema);

export class UserModel {

  static async generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    user.tokens = user.tokens.concat({ token });
    await user.save(); // Guardamos el token en el array de tokens del usuario en la base de datos
    return token;
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
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales incorrectas');
    }
    return user;
  }

  static async logOutUser() { }

  static async logAuthAllUser(user, token) {
    user.tokens = user.tokens.filter((userToken) => userToken.token !== token);
    await user.save();
  }
}

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bycrypt.hash(user.password, 8);
  }
  next();
});
