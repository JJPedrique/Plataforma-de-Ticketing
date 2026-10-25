import EventoCard from '../components/EventosCard';
import Steps from '../components/Steps';
import {seedData} from '../../../Data/Mock'

function SeleccionarEvento() {
    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu Evento.'/>
    
        <div className='grid grid-cols-3 gap-3'>
            {seedData.events.map((i)=>
                {
                    const venues = seedData.venues.find(v => v.id === i.venue_id)
                    return <EventoCard event={i} venue={venues}/>
                }
            )} 
        </div>
        
    </>);
}

export default SeleccionarEvento;