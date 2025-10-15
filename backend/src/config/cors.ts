import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {  // esta sera un objeto que tenga la configuracion de cors
    // origin es el origen de la peticion yel callback es una funcion que se ejecuta cuando se hace la peticion
    origin: function(origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
        callback(null, true);
        console.log('Permitir conexión');
    } else {
        callback(new Error('No permitido'));
        console.log('Denegar la conexión');
    }
}
}