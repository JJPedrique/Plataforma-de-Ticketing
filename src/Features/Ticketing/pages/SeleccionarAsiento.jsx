import { Link } from 'react-router-dom';
import Steps from '../components/Steps';

function SeleccionarAsiento() {
    return ( <>
    <Steps Number='2' Text='Elige tu Asiento.' />

    
    <Link to='/Eventos'>Atras</Link>
    <Link to='/Pagos'>Siguiente</Link>
    </> );
}

export default SeleccionarAsiento;