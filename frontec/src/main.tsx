/* maint.tsx es el archivo principal, renderiza toda la aplicaion jaja */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // react en el cliente
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // queryClient es para 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Router from './router'

const queryClient = new QueryClient() // declaromos react query para toda la aplicacion

createRoot(document.getElementById('root')!).render(  // aca se renderiza todo el arbol de componentes 
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* habilita react query de forma global */}
      <Router />
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </StrictMode>,
)
