import EventoCard from '../components/EventoCard';
import Steps from '../components/Steps';
import FiltroEvento from '../components/FiltrosEvento';
import { useState } from 'react';
import { GetEventAll, GetEventByName } from '../services/Evento';

function SeleccionarEvento() {

    const [events, setEvents] = useState(GetEventAll());

    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu evento.' subText="Elige el evento al que deseas asistir"/>
        <FiltroEvento onSearch={(text) => setEvents(GetEventByName(text))} count={events.length}/>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {events.map((i)=> <EventoCard key={i.id} Data={i} />)} 
        </div>
    </>);
}

export default SeleccionarEvento;