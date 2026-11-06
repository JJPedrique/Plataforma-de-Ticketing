import EventoCard from '../components/EventosCard';
import Steps from '../components/Steps';
import {seedData} from '../../../Data/Mock'
 
import FiltroEvento from '../components/FiltrosEvento';

function SeleccionarEvento({selected, onChangeEvent}) {

    const DATA = seedData.events.filter((event) => event.is_active).map((event) => ({
    event: event,venue: seedData.venues.find((venue) => venue.id === event.venue_id)}));
    
    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu evento.' subText="Elige el evento al que deseas asistir"/>
            
        <FiltroEvento/>
    
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {DATA.map((i)=> <EventoCard
                key={i.event.id} Data={i} 
                isSelected={i.event.id===selected?.event.id} 
                onClick={(i)=>onClick(i)}/>)
            } 
        </div>
        
    </>);
}

export default SeleccionarEvento;