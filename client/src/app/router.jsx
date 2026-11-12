import { createBrowserRouter, Navigate } from 'react-router'
import { Layout } from '../core/layout/Layout'
import { NoEncontrada } from '../core/layout/NoEncontrada'
import App from '../Features/Static/Pages/App'
import IniciarSesion from '../Features/InicioSesion/Pages/IniciarSesion'
import Registro from '../Features/InicioSesion/Pages/Registro'
import RecuperarContrasena from '../Features/InicioSesion/Pages/RecuperarContrasena'
import RestablecerContrasena from '../Features/InicioSesion/Pages/RestablecerContrasena'
import Dashboard from '../Features/GestorEventos/Pages/Dashboard'
import GestionEventos from '../Features/GestorEventos/Pages/GestionEventos'
import Ticketing from '../Features/Ticketing/pages/Ticketing'
import HistorialTickets from '../Features/Ticketing/pages/HistorialTickets'
import PrivacyPolicy from '../Features/Static/Pages/PrivacyPolicy'
import Politicas from '../Features/Static/Pages/Politicas'
import AcercaDeNosotros from '../Features/Static/Pages/AcercaDeNosotros'
import PreguntasFrecuentes from '../Features/Static/Pages/PreguntasFrecuentes'
import Contacto from '../Features/Static/Pages/Contacto'

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
      { path: '/Cliente/Historial', Component: HistorialTickets },
      { path: '/MisTickets', Component: HistorialTickets },
      { path: '/PrivacyPolicy', Component: PrivacyPolicy },
      { path: '/Politicas', Component: Politicas },
      { path: '/AcercaDeNosotros', Component: AcercaDeNosotros },
      { path: '/PreguntasFrecuentes', Component: PreguntasFrecuentes },
      { path: '/Contacto', Component: Contacto },
      { path: '*', Component: NoEncontrada }, // 404: cualquier ruta que no coincida
    ],
  },
])
