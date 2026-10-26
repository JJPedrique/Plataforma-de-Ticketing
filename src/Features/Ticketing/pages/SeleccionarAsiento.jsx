import { ImageOff } from 'lucide-react';
import Steps from '../components/Steps';
import ExampleKonvas from '../components/ExampleKonvas';

function SeleccionarAsiento() {
    return ( 
    <>
        <Steps Number='2' Text='Elige tu Asiento.' />
        
        <div >
         <ExampleKonvas></ExampleKonvas>
        </div>

    </> );
}

export default SeleccionarAsiento;