import Steps from '../components/Steps';
import ExampleKonvas from '../components/ExampleKonvas';

function SeleccionarAsiento() {
    return ( 
    <>
        <div className="mb-6">
            <Steps Number='2' Text='Elige tu asiento.' />
            <p className="ml-16 -mt-4 text-sm text-gray-600">Selecciona los asientos que deseas reservar</p>
        </div>
        
        <ExampleKonvas />

    </> );
}

export default SeleccionarAsiento;