// Importación de tipos de Express para manejar requests, responses y middleware
// NextFunction es para pasar el control al siguiente middleware
import type { Request, Response, NextFunction } from 'express'
// Importación de la librería jsonwebtoken para verificar tokens JWT
import jwt from 'jsonwebtoken'
// Importación del modelo User y su interfaz IUser desde el directorio de modelos
import User, { IUser } from '../models/User'

// Declaración global para extender la interfaz Request de Express
// Agrega una propiedad opcional 'user' de tipo IUser a todas las requests
declare global {
    namespace Express {
        interface Request {
            // El usuario autenticado se agregará aquí por el middleware
            // El '?' indica que es opcional (solo existe después de autenticación)
            user?: IUser
        }
    }
}

/**
 * Middleware de autenticación que verifica tokens JWT
 * Extrae el usuario del token y lo agrega a req.user para uso posterior
 * Si el token es inválido, retorna error sin pasar al siguiente middleware
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    // Extrae el header de autorización que debe venir en formato "Bearer <token>"
    const bearer = req.headers.authorization

    // Verifica que el header de autorización esté presente
    if(!bearer) {
        // Si no hay header de autorización, retorna error 401 (no autorizado)
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    // Separa "Bearer" del token real (ej: "Bearer eyJhbGciOiJIUzI1NiIs...")
    // El primer elemento (índice 0) es "Bearer", el segundo (índice 1) es el token
    const [, token] = bearer.split(' ')

    // Verifica que el token esté presente después de separar "Bearer"
    if(!token) {
        // Si no hay token después de "Bearer", retorna error 401
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    try {
        // Verifica y decodifica el token JWT usando el secreto de la variable de entorno
        const result = jwt.verify(token, process.env.JWT_SECRET)
        // Verifica que el resultado sea un objeto y contenga un ID de usuario
        if(typeof result === 'object' && result.id) {
            // Busca al usuario en la base de datos usando el ID del token decodificado
            // .select('-password') excluye el campo password por seguridad
            const user = await User.findById(result.id).select('-password')
            if(!user) {
                // Si no encuentra el usuario en la base de datos, retorna error 404
                const error = new Error('El Usuario no existe')
                return res.status(404).json({error: error.message})
            }
            // Agrega el usuario autenticado a la request para que esté disponible en los controladores
            req.user = user
            // Llama a next() para continuar con el siguiente middleware o controlador
            next()
        }
    } catch (error) {
        // Si hay cualquier error en el proceso (token inválido, expirado, etc.)
        // retorna error 500 con mensaje genérico de token no válido
        res.status(500).json({error: 'Token No Válido'})
    }
}