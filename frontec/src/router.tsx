// se define que componente se muestre cuando un usuario visite un url
import { BrowserRouter, Route, Routes } from "react-router-dom"; // los {} son para importar solo lo que necesitamos
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
export default function Router() {
    return (
        // BrowserRouter es el componente que se encarga de manejar las rutas (es el que se encarga de renderizar el componente), habilita las rutas
        <BrowserRouter>  
        {/* Routes es el componente que se encarga de manejar las rutas (es el que se encarga de renderizar el componente), habilita las rutas */}
          <Routes> 
                <Route element={<AuthLayout />}> // aplica el layout a las vistas login o register ruta padre
        
                    <Route path='/auth/login' element={<LoginView />} />
                
                    <Route path='/auth/register' element={<RegisterView />} />

                </Route>
                {/* diseñó de la aplicacion */}
                <Route path="/admin" element={<AppLayout />}>
                {/* route index toma el path de padre y el elemento */}
                    <Route index={true} element={<LinkTreeView />} />

                    <Route path="profile" element={<ProfileView />} /> {/* es una ruta anidada  */}

                </Route>
          </Routes>
          </BrowserRouter>
    )
}

