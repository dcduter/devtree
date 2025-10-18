import { Outlet } from "react-router-dom"; //Oulet se usa para definir el contenido de la vista (login y register)
// componente para layout de diferentes vistas
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <>
    <div className="bg-slate-800 min-h-screen">
            <div className="max-w-lg mx-auto pt-10 px-5">
                <img src="/logo.svg" alt="Logo de DevTree"/>
                <div className="py-10">
                {/* aplica el layout a las vistas login o register (usado en router) */}
                    <Outlet /> 
                </div>
            </div>
        </div>
        {/* Toaster se usa para mostrar mensajes de alerta */}
        <Toaster position="top-right" /> 
    </>
  )
}
