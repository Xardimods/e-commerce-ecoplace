import jwt from 'jsonwebtoken';
import { UserModel } from '../models/database/users.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Usa variable de entorno para la clave secreta
        const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Por favor, autentícate.' });
    }
};

export default auth;