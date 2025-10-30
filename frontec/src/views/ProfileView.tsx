

// Importación de React (implícita en archivos .tsx modernos)
// import React from 'react'; // <- No necesaria con JSX Transform

/**
 * Componente funcional que renderiza el formulario de edición de perfil de usuario
 * Permite editar información como handle, descripción e imagen
 */
import {useForm} from 'react-hook-form';
import ErrorMessage from '../components/ErrorMessage';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Profile_Form, User } from '../types';
import { update_profile } from '../api/DevTreeAPI';
import { toast } from 'sonner';

export default function ProfileView() {

    const query_client = useQueryClient ()
    // getQueryData obtines los datos cacheados
    const data : User = query_client.getQueryData(['user'])! // el ! indica que el User para data siempre existe

    const {register, handleSubmit, formState: {errors}} = useForm<Profile_Form> ({
        defaultValues: {handle: data.handle, 
                        description: data.description}
    })

    const handl_user_profile_form = (formData : Profile_Form) => {
        console.log(formData)
        update_profile_mutation.mutate(formData)// se le pasan los valores para la mutacion
    }

    const update_profile_mutation = useMutation ({
        mutationFn: update_profile, // es la funcion que va a utilizar la mutacion
        onError: (error) => { // se ejecuta si hay un error
            toast.error(error.message)
        }, onSuccess: (data) => {
            toast.success(data)
            query_client.invalidateQueries({queryKey: ['user'] })// actualiza el perfil del usuario sin recargar la pagina
        }
    })

    return (
        // Formulario principal con estilos de Tailwind CSS y manejador de submit vacío
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handl_user_profile_form)}
        >
            {/* Título del formulario centrado */}
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>

            {/* Contenedor del campo Handle con grid layout */}
            <div className="grid grid-cols-1 gap-2">
                {/* Etiqueta para el campo handle */}
                <label
                    htmlFor="handle"
                >Handle:</label>
                {/* Campo de entrada de texto para el handle/nombre de usuario */}
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle',{
                        required: "El nombre de usuario es obligatorio"
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>} {/* toma los mensajes de ProfileView */}
            </div>

            {/* Contenedor del campo Descripción con grid layout */}
            <div className="grid grid-cols-1 gap-2">
                {/* Etiqueta para el campo descripción */}
                <label
                    htmlFor="description"
                >Descripción:</label>
                {/* Área de texto para la descripción del usuario */}
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                     {...register('description',{
                        required: "La descripicon es obligatoria"
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            {/* Contenedor del campo Imagen con grid layout */}
            <div className="grid grid-cols-1 gap-2">
                {/* Etiqueta para el campo imagen */}
                <label
                    htmlFor="handle"
                >Imagen:</label>
                {/* Campo de entrada de archivo para subir imagen */}
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={ () => {} }
                />
            </div>

            {/* Botón de submit para guardar los cambios */}
            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}