import axios from "axios";

const api = axios.create({ // crea un instancia de axios
    baseURL: import.meta.env.VITE_API_URL, // url base de la api (inyecta la url de base)
})


// Configura un interceptor para agregar el token de autenticación al encabezado de cada solicitud
// Los interceptors son funciones que se ejecutan antes y después de cada solicitud de Axios
// En este caso, se agrega el token de autenticación al encabezado de la solicitud si está presente en el almacenamiento local
// La función interceptors.request se ejecuta antes de enviar la solicitud y debe devolver la configuración de la solicitud modificada
// La función interceptors.response se ejecuta después de recibir la respuesta y puede modificar la respuesta devuelta
// En este caso, agregamos el token de autenticación al encabezado de la solicitud si está presente en el almacenamiento local
// La condición if(token) verifica si existe un token en el almacenamiento local antes de agregarlo al encabezado de la solicitud
// La línea config.headers.Authorization = `Bearer ${token}` agrega el token al encabezado de la solicitud con el esquema de autenticación "Bearer"
api.interceptors.request.use((config)=> {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('AUTH_TOKEN')
    // Si el token existe, agregarlo al encabezado de la solicitud
    if(token) {
        // Agregar el token al encabezado de la solicitud con el esquema de autenticación "Bearer"
        config.headers.Authorization = `Bearer ${token}`
    }

    // Devolver la configuración de la solicitud modificada
    return config
})

export default api