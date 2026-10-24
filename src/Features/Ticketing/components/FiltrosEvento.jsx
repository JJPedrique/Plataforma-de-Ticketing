import { Search, X } from 'lucide-react'
import { useState } from 'react'

export function FiltroEvento({ busqueda, onBuscar }) {
  // M3 · Lo que se está escribiendo vive aquí; la búsqueda "oficial" vive en el padre.
  // Así no se busca en cada tecla, solo al enviar.
  const [texto, setTexto] = useState(busqueda)

  function enviar(e) {
    e.preventDefault() // sin esto, el navegador recarga la página
    onBuscar(texto.trim())
  }

  function limpiar() {
    setTexto('')
    onBuscar('')
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3">
      <form onSubmit={enviar} className="flex min-w-64 flex-1 gap-2" role="search">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por título…"
            aria-label="Buscar película"
            className="pl-9 p-2 border w-full border-gray-400 rounded-2xl"
          />
          {texto && (
            <button type="button" onClick={limpiar} aria-label="Limpiar búsqueda" className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
        <button className='bg-amber-400 px-3 rounded-2xl' type="submit">Buscar</button>
      </form>
    </div>
  )
}
