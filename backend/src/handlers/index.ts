// Importación de tipos de Express para manejar requests y responses
// Request: representa la solicitud HTTP, Response: representa la respuesta HTTP
import type { Request, Response } from 'express'
// Middleware para validar resultados de validaciones en express-validator
import { validationResult } from 'express-validator'
// Librería para generar slugs (URLs amigables) a partir de texto
import slug from 'slug'
// Librería para manejar formularios multipart (archivos) en requests HTTP
import formidable from 'formidable'
// Librería para generar identificadores únicos universales (UUID v4)
import { v4 as uuid } from 'uuid'
// Importación del modelo User desde el directorio de modelos
import User from "../models/User"
// Importación de funciones de utilidad para autenticación (verificar y hashear passwords)
import { checkPassword, hashPassword } from '../utils/auth'
// Importación de función para generar tokens JWT (JSON Web Tokens)
import { generateJWT } from '../utils/jwt'
// Importación de configuración de Cloudinary para manejo de imágenes en la nube
import cloudinary from '../config/cloudinary'

/**
 * Controlador para crear una nueva cuenta de usuario
 * Recibe datos del usuario y los valida antes de guardarlos en la base de datos
 */
export const createAccount = async (req: Request, res: Response) => {
    // Extrae email y password del body de la request
    const { email, password } = req.body
    // Verifica si ya existe un usuario con el mismo email en la base de datos
    const userExists = await User.findOne({ email })
    if (userExists) {
        // Si existe, retorna error 409 (conflicto) con mensaje descriptivo
        const error = new Error('Un usuario con ese mail ya esta registrado')
        return res.status(409).json({ error: error.message })
    }

    // Genera un handle (slug) a partir del nombre de usuario proporcionado
    const handle = slug(req.body.handle, '')
    // Verifica si el handle ya está en uso por otro usuario
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        // Si existe, retorna error 409 (conflicto) con mensaje descriptivo
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    // Crea una nueva instancia del modelo User con los datos del request body
    const user = new User(req.body)
    // Hashea el password antes de guardarlo por seguridad
    user.password = await hashPassword(password)
    // Asigna el handle generado al usuario
    user.handle = handle

    // Guarda el nuevo usuario en la base de datos
    await user.save()
    // Responde con éxito 201 y mensaje de confirmación
    res.status(201).send('Registro Creado Correctamente')
}

/**
 * Controlador para autenticar a un usuario
 * Valida credenciales y retorna un token JWT si son correctas
 */
export const login = async (req: Request, res: Response) => {

    // Validar errores de validación de express-validator
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Si hay errores de validación, retorna error 400 con detalles
        return res.status(400).json({ errors: errors.array() })
    }

    // Extrae email y password del body de la request
    const { email, password } = req.body

    // Busca al usuario en la base de datos por email
    const user = await User.findOne({ email })
    if (!user) {
        // Si no existe el usuario, retorna error 404
        const error = new Error('El Usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    // Verifica si el password proporcionado coincide con el password hasheado del usuario
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        // Si el password es incorrecto, retorna error 401 (no autorizado)
        const error = new Error('Password Incorrecto')
        return res.status(401).json({ error: error.message })
    }

    // Si las credenciales son correctas, genera un token JWT con el ID del usuario
    const token = generateJWT({ id: user._id })

    // Retorna el token JWT como respuesta
    res.send(token)
}

/**
 * Controlador para obtener información del usuario autenticado
 * Retorna los datos del usuario que está en req.user (agregado por middleware de auth)
 */
export const getUser = async (req: Request, res: Response) => {
    // Retorna el usuario autenticado que viene del middleware de autenticación
    res.json(req.user)
}

/**
 * Controlador para actualizar el perfil del usuario autenticado
 * Permite cambiar descripción, links y handle, con validaciones correspondientes
//  */
// export const updateProfile = async (req: Request, res: Response) => {
//     try {
        
//     } catch (e) {
//         const error= new Error ('Hubo un error ')  
//         return res.status(500).json({error: error.message})      
//     }
// }
export const updateProfile = async (req: Request, res: Response) => {
    try {
        // Extrae los campos a actualizar del body de la request
        const { description, links } = req.body

        // Genera un slug a partir del handle proporcionado
        const handle = slug(req.body.handle, '')
        // Verifica si el handle ya existe en la base de datos
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== req.user.email) {
            // Si existe y no pertenece al usuario actual, retorna error de conflicto
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({ error: error.message })
        }

        // Actualiza los campos del usuario autenticado con los nuevos valores
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        // Guarda los cambios en la base de datos
        await req.user.save()
        // Responde con mensaje de éxito
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        // Manejo de errores genérico en caso de fallo
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}
/**
 * Controlador para subir imágenes de perfil de usuario
 * Utiliza formidable para parsear archivos y Cloudinary para almacenamiento en la nube
 */
export const uploadImage = async (req: Request, res: Response) => {
    // Configura formidable para manejar un solo archivo (no múltiples)
    const form = formidable({ multiples: false })
    try {
        // Parsea la request para extraer archivos y campos del formulario
        form.parse(req, (error, fields, files) => {
            // Sube el archivo a Cloudinary con un ID público único generado con UUID
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    // Si hay error en la subida, retorna error 500
                    const error = new Error('Hubo un error al subir la imagen')
                    return res.status(500).json({ error: error.message })
                }
                if (result) {
                    // Si la subida es exitosa, guarda la URL segura en el perfil del usuario
                    req.user.image = result.secure_url
                    await req.user.save()
                    // Retorna la URL de la imagen subida como respuesta JSON
                    res.json({ image: result.secure_url })
                }
            })
        })
    } catch (e) {
        // Manejo de errores genérico para la función uploadImage
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

/**
 * Controlador para obtener información de un usuario por su handle
 * Busca un usuario público excluyendo datos sensibles como email y password
 */
export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        // Extrae el handle de los parámetros de la URL
        const { handle } = req.params
        // Busca el usuario por handle, excluyendo campos sensibles (_id, __v, email, password)
        const user = await User.findOne({ handle }).select('-_id -__v -email -password')
        if (!user) {
            // Si no encuentra el usuario, retorna error 404
            const error = new Error('El Usuario no existe')
            return res.status(404).json({ error: error.message })
        }
        // Retorna los datos públicos del usuario
        res.json(user)
    } catch (e) {
        // Manejo de errores genérico para la función getUserByHandle
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

/**
 * Controlador para verificar si un handle de usuario está disponible
 * Útil para validaciones en el frontend antes de crear una cuenta
 */
export const searchByHandle = async (req: Request, res: Response) => {
    try {
        // Extrae el handle del body de la request
        const { handle } = req.body
        // Busca si ya existe un usuario con ese handle
        const userExists = await User.findOne({handle})
        if(userExists) {
            // Si existe, retorna error 409 indicando que no está disponible
            const error = new Error(`${handle} ya está registrado`)
            return res.status(409).json({error: error.message})
        }
        // Si no existe, indica que el handle está disponible
        res.send(`${handle} está disponible`)
    } catch (e) {
        // Manejo de errores genérico para la función searchByHandle
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}