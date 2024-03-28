import { UserModel } from "../models/database/users.js";

export class UserController {
  static async getUser(req, res) {

  }

  static async createUser(req, res) {
    const getUserByRequest = req.body;
    const userCreated = await UserModel.createUser(getUserByRequest);
    res.status(201).send(userCreated);
  }

  static async updateUser(req, res) { }

  static async deleteUser(req, res) { }

  static async logInUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.logInUser({ email, password });
      const token = await UserModel.generateAuthToken(user);
      res.status(200).json({
        user: {
          email: user.email,
        },
        token
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async logOutUser(req, res) {
    try {
      await UserModel.logOutUser(req.user, req.token);
      res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error logging out', error: error.message });
    }
  }

  static async logAuthAllUser(req, res) { }
}