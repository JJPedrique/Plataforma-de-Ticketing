import Steps from '../components/Steps';
import ExampleKonvas from '../components/ExampleKonvas';

function SeleccionarAsiento() {
    return ( 
    <>
        <Steps Number='2' Text='Elige tu asiento.' subText='Selecciona los asientos que deseas reservar' />
  
      
        <ExampleKonvas />

    </> );
}

export default SeleccionarAsiento;