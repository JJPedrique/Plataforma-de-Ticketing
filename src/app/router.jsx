import { createBrowserRouter, Navigate } from 'react-router'
import { Layout } from '../core/layout/Layout'
import { NoEncontrada } from '../core/layout/NoEncontrada'
import App from '../App'
import IniciarSesion from '../Features/InicioSesion/Pages/IniciarSesion'
import Registro from '../Features/InicioSesion/Pages/Registro'
import RecuperarContrasena from '../Features/InicioSesion/Pages/RecuperarContrasena'
import RestablecerContrasena from '../Features/InicioSesion/Pages/RestablecerContrasena'
import Dashboard from '../Features/GestorEventos/Pages/Dashboard'
import GestionEventos from '../Features/GestorEventos/Pages/GestionEventos'
import Ticketing from '../Features/Ticketing/pages/Ticketing'

// M8 · El mapa de la app: qué componente se pinta para cada URL (como app.routes.ts en Angular)
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout, // la ruta padre: Header + <Outlet /> + footer
    children: [
      { index: true, element: <Navigate to="/Inicio" replace /> },
      { path: '/Inicio', Component: App },
      { path: '/IniciarSesion', Component: IniciarSesion },
      { path: '/Registro', Component: Registro },
      { path: '/RecuperarContrasena', Component: RecuperarContrasena },
      { path: '/RestablecerContrasena', Component: RestablecerContrasena },
      { path: '/Admin', Component: Dashboard },
      { path: '/Admin/Eventos', Component: GestionEventos },
      { path: '/Organizador/Eventos', Component: GestionEventos },
      { path: '/Operador', Component: IniciarSesion },
      { path: '/Cliente/Ticketing', Component: Ticketing },
      { path: '*', Component: NoEncontrada }, // 404: cualquier ruta que no coincida
    ],
  },
])
