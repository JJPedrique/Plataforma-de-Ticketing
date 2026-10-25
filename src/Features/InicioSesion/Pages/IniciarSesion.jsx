import { Link } from "react-router-dom";

function IniciarSesion() {
    return ( <>
        <h1>Mauro Hace tu magia aqui</h1>

        <Link to='/Admin'>Entrar Como Admin</Link>    
        <Link to='/Operador'>Entrar Como Operador</Link>    
        <Link to='/Cliente/Ticketing/Evento'>Entrar Como Cliente</Link>    
    </>);
}

export default IniciarSesion;