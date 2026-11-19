import EventoCard from '../components/EventoCard';
import Steps from '../components/Steps';
import FiltroEvento from '../components/FiltrosEvento';
import { useContext, useEffect, useState } from 'react';
import { eventService } from '../services/Eventos';
import { TicketingContext } from '../Context/TicketingContext';
import { ticketService } from '../services/Asientos';

function SeleccionarEvento() {

    const {event,seats, setEvent,setSeats} = useContext(TicketingContext);

    const [AllEvents, setAllEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try {
            setLoading(true);
            const params = {title: search.trim() || undefined};
            const data = await eventService.getAll(params, controller.signal);
            setAllEvents(data);
        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {setLoading(false);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};
    }, [search]);

    function ElegirEvento(newEvent){ 
        setEvent((prev) => (prev === newEvent ? null : newEvent));
        if(!event){return;}

        seats.map(seat => {   
            setLoading(true);
            const controller = new AbortController();
            const timer = setTimeout(async () => {
            try {
                const oldSeat = seats.find(s => s.seat.id === seat.id);
                if (oldSeat){
                    await ticketService.delete(oldSeat.ticket,controller.signal);
                    return;
                }
            } catch (error) {
                if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
            } finally {setLoading(false);}
            }, 400);

            return () => {clearTimeout(timer); controller.abort();};
        });
        setSeats([]);
    }

    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu evento.' subText="Elige el evento al que deseas asistir"/>
        <FiltroEvento onSearch={(text) => setSearch(text)} count={AllEvents.length}/>
        
        {loading ? (<>
            <h1>Loading...</h1>
        </>)
        :(<>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {AllEvents.map((i)=> <EventoCard key={i.id} Data={i} onClick={ElegirEvento}/>)} 
            </div>
        </>)}
    </>);
}

export default SeleccionarEvento;