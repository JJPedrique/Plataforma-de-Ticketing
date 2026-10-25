import { createBrowserRouter, Navigate } from 'react-router'
import { Layout } from '../core/layout/Layout'
import { NoEncontrada } from '../core/layout/NoEncontrada'
import App from '../App'
import IniciarSesion from '../Features/InicioSesion/Pages/IniciarSesion'
import Dashboard from '../Features/GestorEventos/Pages/Dashboard'
import SeleccionarAsiento from '../Features/Ticketing/pages/SeleccionarAsiento'
import SeleccionarEvento from '../Features/Ticketing/pages/SeleccionarEvento'
import RealizarPago from '../Features/Ticketing/pages/RealizarPago'
import ReservaCompletada from '../Features/Ticketing/pages/ReservaCompletada'

// M8 · El mapa de la app: qué componente se pinta para cada URL (como app.routes.ts en Angular)
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout, // la ruta padre: Header + <Outlet /> + footer
    children: [
      { index: true, element: <Navigate to="/Inicio" replace /> },
      { path: '/Inicio', Component: App },
      { path: '/IniciarSesion', Component: IniciarSesion },
      
      { path: '/Admin', Component: Dashboard },
      
      { path: 'Operador', Component: IniciarSesion },
      
      { path: '/Cliente', Component: SeleccionarAsiento },
      { path: '/Cliente/Ticketing/Evento', Component: SeleccionarEvento },
      { path: '/Cliente/Ticketing/Asiento', Component: SeleccionarAsiento },
      { path: '/Cliente/Ticketing/Pago', Component: RealizarPago },
      { path: '/Cliente/Ticketing/Completado', Component: ReservaCompletada },





      { path: '*', Component: NoEncontrada }, // 404: cualquier ruta que no coincida
    ],
  },
])
