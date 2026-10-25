import { Link } from 'react-router-dom';
import './App.css'
import { TicketCheck } from "lucide-react";

function App() {

  return (
    <>
      <div className="CenterDiv gap-3 rounded-2xl">
          <TicketCheck className="size-24 text-white bg-amber-500 p-5 rounded-full"/>
          <h1 className="font-bold text-5xl">Empieza a Comprar tus Tickets.</h1>
          <Link to='/IniciarSesion'>Iniciar Sesion</Link>
      </div> 
    </>
  )
}

export default App
