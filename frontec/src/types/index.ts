// type para login
export type User ={// se usa para tipar el usuario
    handle: string,
    name: string,
    email: string,
    password: string, 
}
// type para registro
export type RegisterForm = Pick<User, 'handle' | 'name' | 'email'> & {// Pick es para seleccionar ciertas propiedades de un tipo
    password: string
    password_confirmation: string
}