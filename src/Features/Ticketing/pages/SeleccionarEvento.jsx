import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";
import { FiltroEvento } from '../components/FiltrosEvento';
import Header from '../../../shared/components/Header';

function SeleccionarEvento() {
    return ( 
    <>
        <Header/>  
        <Steps Number='1' Text='Selecciona tu Evento.'/>

        <main className='px-6'>
            <FiltroEvento/>


        </main>

        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-end items-center'>
            <ButtonLink Path='/Asientos' Text='Siguiente' />
        </div>
    </>);
}

export default SeleccionarEvento;