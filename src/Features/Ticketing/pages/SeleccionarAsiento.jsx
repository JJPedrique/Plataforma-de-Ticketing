import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";

function SeleccionarAsiento() {
    return ( 
    <>
        <Steps Number='2' Text='Elige tu Asiento.' />
        

        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-between items-center'>
            <ButtonLink Path='/Cliente/Ticketing/Evento' Text='Atras' />
            <ButtonLink Path='/Cliente/Ticketing/Pago' Text='Siguiente' />
        </div>
    </> );
}

export default SeleccionarAsiento;