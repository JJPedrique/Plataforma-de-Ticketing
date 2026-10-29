import Steps from '../components/Steps';
import ExampleKonvas from '../components/ExampleKonvas';

function SeleccionarAsiento({ event, seats, onChangeSeats }) {
    return ( 
    <>
        <Steps Number='2' Text='Elige tu asiento.' subText='Selecciona los asientos que deseas reservar' />
  
      
        <ExampleKonvas event={event} seats={seats} onChangeSeats={onChangeSeats} />

    </> );
}

export default SeleccionarAsiento;