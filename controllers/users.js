import { UserModel } from "../models/database/users.js"

export class UserController {
  static async getUser(req, res) {
    res.send(req.user)
  }

  static async createUser(req, res) {
    try {
      const userCreated = await UserModel.createUser(req.body);
      res.status(201).send(userCreated);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async updateUser(req, res) { 
    try {
      const user = await UserModel.updateUser(req.user._id, req.body)
      res.json(user);
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }

  static async deleteUser(req, res) { 
    try {
      await UserModel.deleteUser(req.user._id);
      res.send({ message: 'User eliminated succesfull.' })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async logInUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.logInUser({ email, password })
      if (user) {
        const token = await user.generateAuthToken()
        res.status(200).json({
          email: user.email,
          token
        })
      } else {
        res.status(400).send("Error authenticated user.")
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async logOutUser(req, res) {
    try {
      await UserModel.logOutUser(req.user, req.token);
      res.status(200).send({ message: 'Logged out successfully' })
    } catch (error) {
      res.status(500).send({ message: 'Error logging out', error: error.message })
    }
  }

  static async logAuthAllUser(req, res) { 
    try {
      await UserModel.logAuthAllUser(req.user);
      res.status(200).send({ message: 'All sessions have been closed successfully.' })
    } catch (error) {
      res.status(500).send({ message: 'Error closing all sessions.', error: error.message })
    }
  }
}