import express from 'express' // espress es un framework para crear aplicaciones web
import cors from 'cors' // cors es un middleware que permite que la aplicacion reciba peticiones de diferentes orígenes
import 'dotenv/config' // dotenv es un paquete que permite que la aplicacion use variables de entorno
import router from './router' // router es el enrutador de la aplicacion
import { connectDB } from './config/db' // connectDB es la funcion que conecta a la base de datos
import { corsConfig } from './config/cors' // corsConfig es la configuracion de cors

connectDB()

const app = express()

// Cors es middleware para toda la aplicacion
// corsConfig es la configuracion de cors
app.use(cors(corsConfig))

// Leer datos de formularios
app.use(express.json())

app.use('/', router)
  
export default app