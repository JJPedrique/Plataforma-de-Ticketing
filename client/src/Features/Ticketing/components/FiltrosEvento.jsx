import { Search, Calendar } from 'lucide-react'
import { useState } from 'react'

export function FiltroEvento({onSearch,count}) {

  const [texto, setTexto] = useState('');

const handleChange = (e) => {
    const nuevoTexto = e.target.value;
    setTexto(nuevoTexto);
    onSearch(nuevoTexto.trim()); // Pasamos el valor actualizado en tiempo real
  };

  return (
    <div className="mb-6 flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={texto}
          onChange={handleChange}
          placeholder="Buscar eventos por nombre o lugar..."
          className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400"
        />
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{count} eventos disponibles</span>
        </div>
    </div>
  )
}

export default FiltroEvento;