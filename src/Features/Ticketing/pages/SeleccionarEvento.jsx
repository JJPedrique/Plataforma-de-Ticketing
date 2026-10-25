import EventoCard from '../components/EventosCard';
import Steps from '../components/Steps';

function SeleccionarEvento() {
    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu Evento.'/>
    
        <div className='grid grid-cols-3 gap-3'>
            {[1,2,3,4,5,6].map((i)=><EventoCard/>)}    
        </div>
        
    </>);
}

export default SeleccionarEvento;