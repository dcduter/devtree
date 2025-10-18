import axios from "axios";

const api = axios.create({ // crea un instancia de axios
    baseURL: import.meta.env.VITE_API_URL, // url base de la api (inyecta la url de base)
})

export default api