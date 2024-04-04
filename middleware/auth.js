import jwt from 'jsonwebtoken'
import { User } from '../models/database/users.js'
import { RoleModel } from '../models/database/roles.js'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication token not found')
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if (!user) {
            throw new Error('User not found with provided token')
        }

        const role = await RoleModel.getById({ id: user.role })
        if (!role) {
            throw new Error('Rol not found')
        }

        req.token = token
        req.user = user
        req.userRole = role.roleName
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please, authenticate.' })
    }
}

const authRole = roles => (req, res, next) => {
    if (roles.includes(req.userRole)) {
        next();
    } else {
        res.status(403).send({ error: 'Access denied. Required role not met.' });
    }
};

export default auth
export { authRole }