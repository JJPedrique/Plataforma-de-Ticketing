import { Link } from 'react-router-dom';
import Steps from '../components/Steps';

function SeleccionarEvento() {
    return ( 
    <>
        <Steps Number='1' Text='Seleccionar Evento.'/>




        <Link to='/Asientos'>Siguiente</Link>
    </>);
}

export default SeleccionarEvento;