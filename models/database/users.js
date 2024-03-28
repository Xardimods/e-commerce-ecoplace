import mongoose from 'mongoose';
import validator from 'validator'
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
    token: String,
    required: true
  }]
});

userSchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

User.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({
    _id: user._id.toString()
  }, process.env.JWT_SECRET_KEY);
  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token;
}

export class UserModel {
  static async getUser() { }

  static async createUser() { }

  static async updateUser() { }

  static async deleteUser() { }

  static async logInUser() { }

  static async logOutUser() { }

  static async logAuthAllUser() { }
}
