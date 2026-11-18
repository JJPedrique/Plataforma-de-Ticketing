import EventoCard from '../components/EventoCard';
import Steps from '../components/Steps';
import FiltroEvento from '../components/FiltrosEvento';
import { useEffect, useState } from 'react';
import { eventService } from '../services/Eventos';

function SeleccionarEvento() {

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try {
            setLoading(true);
            const params = {title: search.trim() || undefined};
            const data = await eventService.getAll(params, controller.signal);
            setEvents(data);
        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {setLoading(false);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};
    }, [search]);

    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu evento.' subText="Elige el evento al que deseas asistir"/>
        <FiltroEvento onSearch={(text) => setSearch(text)} count={events.length}/>
        
        {loading ? (<>
            <h1>Loading...</h1>
        </>)
        :(<>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {events.map((i)=> <EventoCard key={i.id} Data={i} />)} 
            </div>
        </>)}
    </>);
}

export default SeleccionarEvento;