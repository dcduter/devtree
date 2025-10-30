// Importaciones para React Router y componentes de UI
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {getUser} from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";


// Definición del componente AppLayout
export default function AppLayout() {
    const {data, isLoading, isError} = useQuery({
        queryFn: getUser, // funcion que realiza la consulta
        queryKey: ['user'],   // identifica el query de getUser, debe ser unico para cada consulta o funcion
       refetchOnWindowFocus: false

    })

    if (isLoading) return 'Cargando...' // al finalizar carga true o false
    if (isError) return <Navigate to = {'/auth/login'} /> // si hay error (no hay hash en el localstorage) se direcciona la login
    if (data) return <DevTree data={data}/>
}