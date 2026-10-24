import { Link } from 'react-router-dom';
import Steps from '../components/Steps';

function EmitirPago() {
    return ( 
    <>
        <Steps Number='3' Text='Paga el monto correspondiente.' />


        <Link to='/Asientos'>Atras</Link>
        <Link to='/'>Terminar Compra</Link>
    </> );
}

export default EmitirPago;