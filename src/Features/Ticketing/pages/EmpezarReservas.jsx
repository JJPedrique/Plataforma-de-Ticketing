import { TicketCheck } from "lucide-react";
import Header from "../../../shared/components/Header";
import { Link } from 'react-router-dom';
import AnimatedWaveBackground from "../../../shared/components/AnimatedWaveBackground";

function EmpezarReservas() {
    return ( <>
        
        <AnimatedWaveBackground children={
            
            <div className="CenterDiv gap-3 rounded-2xl">
            <TicketCheck className="size-24 text-white bg-amber-500 p-5 rounded-full"/>
            <h1 className="font-bold text-5xl">Empieza a Comprar tus Tickets</h1>
            <Link className="text-2xl bg-amber-500 font-semibold px-3 py-2 m-3 rounded-2xl text-white" to='/Eventos'>Empezar</Link>
        </div>
    }/>
    </> );
}

export default EmpezarReservas;