import jwt from 'jsonwebtoken'
import { User } from '../models/database/users.js'
import { RoleModel } from '../models/database/roles.js'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token']
        console.log(token)

        if(!token) {
            throw new Error('Token not found in the cookies')
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Usa variable de entorno para la clave secreta
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

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
        res.status(401).send({ error: 'Por favor, autentícate.' })
    }
}

const authAdmin = (req, res, next) => {
    if (req.userRole === 'Admin') {
        next()
    } else {
        res.status(403).send({ error: 'Access denied. Administrator role required.' })
    }
}

const authSeller = (req, res, next) => {
    if (req.userRole === 'Seller') {
        next()
    } else {
        res.status(403).send({ error: 'Access denied. Seller role required.' })
    }
}


export default auth
export { authAdmin, authSeller }