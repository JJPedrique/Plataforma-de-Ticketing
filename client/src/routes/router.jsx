import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { Layout } from '../core/layout/Layout'

import App from '../Features/Static/Pages/App'
import NoAutorizado from '../core/layout/NoAutorizado'
import NoEncontrada  from '../core/layout/NoEncontrada'
import Contacto from '../Features/Static/Pages/Contacto'
import PreguntasFrecuentes from '../Features/Static/Pages/PreguntasFrecuentes'
import AcercaDeNosotros from '../Features/Static/Pages/AcercaDeNosotros'
import Politicas from '../Features/Static/Pages/Politicas'
import PrivacyPolicy from '../Features/Static/Pages/PrivacyPolicy'

import IniciarSesion from '../Features/Auth/Pages/IniciarSesion'
import Registro from '../Features/Auth/Pages/Registro'
import RecuperarContrasena from '../Features/Auth/Pages/RecuperarContrasena'
import RestablecerContrasena from '../Features/Auth/Pages/RestablecerContrasena'

import Perfil from '../Features/Usuarios/Pages/Perfil'

import Ticketing from '../Features/Ticketing/pages/Ticketing'
import HistorialTickets from '../Features/Ticketing/pages/HistorialTickets'

import Dashboard from '../Features/GestorEventos/Pages/Dashboard'
import GestionEventos from '../Features/GestorEventos/Pages/GestionEventos'


// M8 · El mapa de la app: qué componente se pinta para cada URL (como app.routes.ts en Angular)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>, // la ruta padre: Header + <Outlet /> + footer
    children: [
      { index: true, element: <Navigate to="/Inicio" replace /> },
      { path: '/Inicio', element: <App/> },
      { path: '/PrivacyPolicy', element: <PrivacyPolicy/> },
      { path: '/Politicas', element: <Politicas/> },
      { path: '/AcercaDeNosotros', element: <AcercaDeNosotros/> },
      { path: '/PreguntasFrecuentes', element: <PreguntasFrecuentes/> },
      { path: '/Contacto', element: <Contacto/> },      
      { path: '/NoAutorizado',element: <NoAutorizado />,}, //401: no se han provisto credenciales válidas
      { path: '*', element: <NoEncontrada/> }, // 404: cualquier ruta que no coincida
      
      // Rutas solo para usuarios NO autenticados
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/IniciarSesion', element: <IniciarSesion/> },
          { path: '/Registro', element: <Registro/> },
          { path: '/RecuperarContrasena', element: <RecuperarContrasena/> },
          { path: '/RestablecerContrasena', element: <RestablecerContrasena/> },
        ],
      },      
      
      // Rutas protegidas (requieren login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/Perfil', element: <Perfil/> },
        ],
      },
    
      // Rutas protegidas con restricción de rol
      {
        element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
        children: [
          { path: '/Ticketing', element: <Ticketing/> },
          { path: '/MisTickets', element: <HistorialTickets/> },
        ],
      },

      // Rutas compartidas entre ORGANIZER y ADMIN
      {
        element: <ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]} />,
        children: [
          { path: '/Dashboard', element: <Dashboard /> },
          { path: '/GestorEventos', element: <GestionEventos /> },
        ],
      },

      // Rutas exclusivas de ADMIN
      {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
          { path: '/GestorUsuarios', element: <GestionEventos /> },
          { path: '/GestorLugares', element: <GestionEventos /> },
          { path: '/GestorMetodosPago', element: <GestionEventos /> },
        ],
      },      
    ],
  },
])