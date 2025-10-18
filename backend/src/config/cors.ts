import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {  // esta sera un objeto que tenga la configuracion de cors
    // origin es el origen de la peticion yel callback es una funcion que se ejecuta cuando se hace la peticion
    origin: function(origin, callback) {
    
    const white_list = [process.env.FRONTEND_URL]
    
    if (process.argv[2] === '--api') { // se ejecuta el script para la conxion de postman 
        white_list.push(undefined)
    }

    if (white_list.includes(origin)) {
        callback(null, true);
        // console.log('Permitir conexión');
    } else {
        callback(new Error('No permitido'));
        console.log('Denegar la conexión');
    }
}
}