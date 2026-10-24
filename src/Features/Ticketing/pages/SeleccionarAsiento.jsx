import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";
import Header from '../../../shared/components/Header';

function SeleccionarAsiento() {
    return ( 
    <>

        <Header/>
        <Steps Number='2' Text='Elige tu Asiento.' />

        <main className='p-6'>


        
        </main>

        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-between items-center'>
            <ButtonLink Path='/Eventos' Text='Atras' />
            <ButtonLink Path='/Pagos' Text='Siguiente' />
        </div>
    </> );
}

export default SeleccionarAsiento;