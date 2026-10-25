import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";

function RealizarPago() {
    return ( 
    <>  
        <Steps Number='3' Text='Paga el monto correspondiente.' />

        <main className='p-6'>


            
        </main>

        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-between items-center'>
            <ButtonLink Path='/Cliente/Ticketing/Asiento' Text='Atras' />
            <ButtonLink Path='/Cliente/Ticketing/Completado' Text='Reservar' />
        </div>

    </> );
}

export default RealizarPago;