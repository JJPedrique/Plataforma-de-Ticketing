import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";

function SeleccionarEvento() {
    return ( 
    <>
        <Steps Number='1' Text='Selecciona tu Evento.'/>



        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-end items-center'>
            <ButtonLink Path='/Cliente/Ticketing/Asiento' Text='Siguiente' />
        </div>
    </>);
}

export default SeleccionarEvento;