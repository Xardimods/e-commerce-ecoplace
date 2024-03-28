import { UserModel } from "../models/database/users.js";

export class UserController {
  static async getUser(req, res) { }

  static async createUser(req, res) {
    const getUserByRequest = req.body;
    const userCreated = await UserModel.createUser(getUserByRequest);
    res.status(201).send(userCreated);
  }

  static async updateUser(req, res) { }

  static async deleteUser(req, res) { }

  static async logInUser(req, res) { }

  static async logOutUser(req, res) { }

  static async logAuthAllUser(req, res) { }
}