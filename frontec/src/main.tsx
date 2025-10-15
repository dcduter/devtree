/* maint.tsx es el archivo principal, renderiza toda la aplicaion jaja */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // react en el cliente
import './index.css'
import Router from './router'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
