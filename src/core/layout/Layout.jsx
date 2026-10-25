import { Outlet, ScrollRestoration } from 'react-router'
import Header from './Header'
import Footer from './Footer'

// M8 · Ruta "padre": lo que se repite en todas las páginas (antes estaba en App).
// <Outlet /> es el hueco donde se pinta la ruta hija, como <router-outlet> en Angular.
export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
