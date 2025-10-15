// componente para cambiar de url o de vista, NavLink resalta la url actual y Link no lo hace
import { Link, NavLink } from "react-router-dom";

export default function RegisterView() {
  return (
    // se ua <> </> para crear un div y mostrar mas de un elemento
    // className es para dar estilos
    <>
        <h1 className="text-4xl text-white font-bold">Iniciar Sesion loca hp</h1>
        <nav className="mt-10" >
            <Link 
            className="text-center text-white text-lg block" to="/auth/register">Registrate pues ome</Link>
        </nav>
    </>
  )
}
