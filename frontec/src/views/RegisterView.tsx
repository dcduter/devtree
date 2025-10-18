// componente para cambiar de url o de vista, NavLink resalta la url actual y Link no lo hace
import { Link, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";// useForm es para manejar el formulario en react. validacion de formularios frontend
import {isAxiosError} from "axios"; //se usa para hacer peticiones http get, post, deletet, put
import { toast } from "sonner"; // se uar para mostrar mensajes de alerta
import ErrorMessage from "../components/ErrorMessage"; // se usa para mostrar errores
import type { RegisterForm } from "../types";
import api from "../config/axios";

export default function RegisterView() {

    const initial_values : RegisterForm = { // se asigna un valor inicial al formulario de string vacio
        name: "",
        email: "",
        handle: "",
        password: "",
        password_confirmation: ""
    }


    const { register, watch, reset, handleSubmit,formState: {errors} } = useForm({defaultValues: initial_values}); // useform se asigna como default initial_values para que typescript infiera que los errores son string
    const contraseña = watch ('password')

    console.log

    const handle_Register = async (formData : RegisterForm) => {

      try {
        const {data} = await api.post("/auth/register", formData ) // el backend y frontend tiene domino independiente
        // reset()

        toast.success(data) // toast se usa para mostrar mensajes de alerta
      } catch (error) {
        if(isAxiosError(error) && error.response){
          toast.error(error.response.data.error)
        }
      }
      // console.log(formData)
    }
  return (
    // se ua <> </> para crear un div y mostrar mas de un elemento
    // className es para dar estilos
    <> 
        <h1 className="text-4xl text-white font-bold">Cree la Cuenta</h1>
        <nav className="mt-10">
            <Link
            className="text-center text-white text-lg block" 
            to="/auth/login">Ya tiene cuenta, ingresa gonorrea ejej</Link>
        </nav>
          <form
              onSubmit={handleSubmit(handle_Register)}
              className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
          >
              <div className="grid grid-cols-1 space-y-3">
                  <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                  <input
                      id="name"
                      type="text"
                      placeholder="Tu Nombre"
                      className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                      {...register("name", { 
                        //validaciones
                        required: "Tu nombre es requerido",
                        minLength: {
                          value: 3,
                          message: "Tu nombre debe tener al menos 3 caracteres"
                        }
                      })}
                  />
                  {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                   {/* si hay error && se usa para mostrar el error atraves del componente ErrorMessage */}
              </div>
              <div className="grid grid-cols-1 space-y-3">
                  <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                  <input
                      id="email"
                      type="email"
                      placeholder="Email de Registro"
                      className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                      {...register("email", {
                        //validaciones
                        required: "Tu email es requerido",
                        pattern: { // pattern es para validar el email
                            value: /\S+@\S+\.\S+/,
                            message: "Tu email es basura perra"
                        }
                      })}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </div>
              <div className="grid grid-cols-1 space-y-3">
                  <label htmlFor="handle" className="text-2xl text-slate-500">Usuario</label>
                  <input
                      id="handle"   
                      type="text"
                      placeholder="Nombre de usuario: sin espacios"
                      className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                      {...register("handle", {
                        //validaciones
                        required: "Tu handle es requerido",
                      })}
                  />
                  {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                  
              </div>
              <div className="grid grid-cols-1 space-y-3">
                  <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                  <input
                      id="password"
                      type="password"
                      placeholder="Password de Registro"
                      className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                      // validaciones
                      {...register("password", { 
                        required: "Tu password es requerido",
                        minLength: {
                          value: 6,
                          message: "Tu password debe tener al menos 6 caracteres"
                        }
                      })}
                  />
                  {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
              </div>

              <div className="grid grid-cols-1 space-y-3">
                  <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                  <input
                      id="password"
                      type="password"
                      placeholder="Repetir Password"
                      className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                      // validaciones
                      {...register("password_confirmation", {
                        required: "Confirma tu password",
                        validate: (value) => value === contraseña || 'Las contraseñas no coinciden inutil de la mierda'
                      })}
                  />
                  {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
              </div>

              <input
                  type="submit"
                  className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                  value='Crear Cuenta'
              />
          </form>
         
    </>
  )
}
