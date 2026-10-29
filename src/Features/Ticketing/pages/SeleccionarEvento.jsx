import EventoCard from '../components/EventosCard';
import Steps from '../components/Steps';
import {seedData} from '../../../Data/Mock'
import { Calendar, Search } from 'lucide-react';

function SeleccionarEvento() {
    return ( 
    <>
        <div className="mb-6">
            <Steps Number='1' Text='Selecciona tu evento.'/>
            <p className="ml-16 -mt-4 text-sm text-gray-600">Elige el evento al que deseas asistir</p>
        </div>

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
    
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {seedData.events.filter(e => e.is_active).map((i)=>
                {
                    const venues = seedData.venues.find(v => v.id === i.venue_id)
                    return <EventoCard key={i.id} event={i} venue={venues}/>
                }
            )} 
        </div>
        
    </>);
}

export default SeleccionarEvento;