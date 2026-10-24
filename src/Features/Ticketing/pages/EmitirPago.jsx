import Steps from '../components/Steps';
import ButtonLink from "../components/ButtonLink";
import Header from '../../../shared/components/Header';

function EmitirPago() {
    return ( 
    <>
        <Header/>   
        <Steps Number='3' Text='Paga el monto correspondiente.' />

        <main className='p-6'>


            
        </main>

        <div className='fixed bottom-0 left-0 w-full p-3 flex justify-between items-center'>
            <ButtonLink Path='/Asientos' Text='Atras' />
            <ButtonLink Path='/' Text='Reservar' />
        </div>

    </> );
}

export default EmitirPago;