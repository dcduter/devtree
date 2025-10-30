// funciones que van a interactuar con la API

import { isAxiosError } from "axios"
import api from "../config/axios"
import type { Profile_Form, User } from '../types'

export async function getUser () {
 
   try {
        const {data} = await api<User>('/user')
        return data // retorna el resultado de la api
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Error al obtener usuario')
    }
}

export async function update_profile (formData : Profile_Form) {
 
   try {
        const {data} = await api.patch<string>('/user', formData)
        console.log(data)
        return data // retorna el resultado de la api
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Error al obtener usuario')
    }
}