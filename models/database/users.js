import mongoose from 'mongoose'
import validator from 'validator'
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
  const user = this
  const userObject = user.toObject()

  delete userObject.password // Eliminar la contraseña del objeto que se devuelve
  delete userObject.tokens // Eliminar tokens para no enviarlos al cliente

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bycrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export { User }

export class UserModel {

  static async createUser(userData) {
    try {
      const createdUser = await User.create(userData);
      return createdUser;
    } catch (error) {
      throw new Error('There was an error creating the user: ' + error.message);
    }
  }

  static async updateUser(userId, updates) { 
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
      // Verificar la contraseña actual
      if (updates.currentPassword && updates.newPassword) {
        const isMatch = await bycrypt.compare(updates.currentPassword, user.password);
        if (!isMatch) {
          throw new Error('Contraseña actual incorrecta');
        }
        user.password = updates.newPassword;
      }
  
      const allowedUpdates = ['name', 'lastname', 'email', 'phone', 'street', 'city', 'country', 'zip'];
      const updateKeys = Object.keys(updates);
  
      updateKeys.forEach((key) => {
        if (allowedUpdates.includes(key)) {
          user[key] = updates[key];
        }
      });
  
      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  static async deleteUser(userId) { 
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }
      await user.remove()
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async logInUser({ email, password }) {
    const user = await User.findOne({ email }).populate('role')
    if (!user) {
      throw new Error('Credenciales incorrectas')
    }
    const isMatch = await bycrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Credenciales incorrectas')
    }

    return {user, roleName: user.role.roleName}
  }

  static async logOutUser(user, token) { 
    user.tokens = user.tokens.filter((userToken) => userToken.token !== token)
    await user.save()
  }

  static async logAuthAllUser(user) {
    user.tokens = []
    await user.save()
  }

  static async findAllUsers() {
    try {
      return await User.find().populate('role', 'roleName');
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  static async findUserById(userId) {
    try {
      const user = await User.findById(userId)
      .select('-_id -__v -bills -insights')
      .populate('role', 'roleName');
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  static async adminUpdateUser(userId, updates) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const allowedUpdates = ['name', 'lastname', 'email', 'phone', 'street', 'city', 'country', 'zip', 'role'];
      const updateKeys = Object.keys(updates);

      updateKeys.forEach(key => {
        if (allowedUpdates.includes(key)) {
          user[key] = updates[key];
        }
      });

      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error updating user by admin: ' + error.message);
    }
  }
}

