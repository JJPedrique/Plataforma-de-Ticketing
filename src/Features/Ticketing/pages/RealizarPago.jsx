import EventoCard from '../components/EventosCard';
import MetodoPagoCard from '../components/MetodoPagoCard';
import SillasCard from '../components/SillasCard';
import Steps from '../components/Steps';
import {seedData} from '../../../Data/Mock'

function RealizarPago() {
    const event = seedData.events.find(v => v.id === 1)
    const venue = seedData.venues.find(v => v.id === event.venue_id)
                
    return ( 
    <>  
        <Steps Number='3' Text='Paga el monto correspondiente.' />
        <div className='grid grid-cols-3 gap-3'>
            <div>
                <h2 className='pb-3 font-bold'>Evento</h2>
                { <EventoCard event={event} venue={venue}/>}
            </div>
            <div>
                <h2 className='pb-3 font-bold'>Asientos</h2>
                <div>
                    
                </div>
            </div>
            <div className='flex flex-col'>
                <h2 className='pb-3 font-bold'>Metodos de Pago</h2>
                <div className='grid grid-cols-1 gap-3'>
                    <MetodoPagoCard img="\src\assets\Mastercard.webp" texto='MasterCard' />
                    <MetodoPagoCard img="\src\assets\PayPal.webp" texto='PayPal' />
                    <MetodoPagoCard img="\src\assets\react.svg" texto='YahanyFia.com' />
                </div> 
            </div>
        </div>
    </> );
}

export default RealizarPago;