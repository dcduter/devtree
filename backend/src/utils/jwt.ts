// json web token
import jwt, { JwtPayload } from 'jsonwebtoken' // permite crear jwt y validarlo

export const generateJWT = (payload : JwtPayload) => { // genera un jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET, { // se definen los parametros del jwt payload es el id del usuario, process.env.JWT_SECRET es la clave secreta
        expiresIn: '180d' // expira en 180 dias
    })
    return token
}