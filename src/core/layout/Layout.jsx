import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// M8 · Ruta "padre": lo que se repite en todas las páginas (antes estaba en App).
// <Outlet /> es el hueco donde se pinta la ruta hija, como <router-outlet> en Angular.
export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <Header />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
