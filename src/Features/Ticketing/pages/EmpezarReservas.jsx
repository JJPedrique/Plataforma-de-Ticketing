import { TicketCheck } from "lucide-react";
import Header from "../../../shared/components/Header";
import ButtonLink from "../components/ButtonLink";

function EmpezarReservas() {
    return ( 
        <>
            <Header />
            <div className="CenterDiv gap-3 rounded-2xl">
                <TicketCheck className="size-24 text-white bg-amber-500 p-5 rounded-full"/>
                <h1 className="font-bold text-5xl">Empieza a Comprar tus Tickets.</h1>
                <ButtonLink Path='/Eventos' Text='Empezar' />
            </div>        
        </> 
    );
}

export default EmpezarReservas;