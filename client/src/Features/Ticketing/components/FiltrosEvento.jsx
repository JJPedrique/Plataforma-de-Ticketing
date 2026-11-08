import { Search, Calendar } from 'lucide-react'
import { useState } from 'react'
import { seedData } from '../../../Data/Mock'

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
    <div className="mb-6 flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
            type="text"
            placeholder="Buscar eventos por nombre o lugar..."
            className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400"
            disabled
        />
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{seedData.events.length} eventos disponibles</span>
        </div>
    </div>
  )
}

export default FiltroEvento;