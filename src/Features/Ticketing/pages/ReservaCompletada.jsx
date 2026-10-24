import { Check, TicketCheck } from "lucide-react";
import Header from "../../../shared/components/Header";
import ButtonLink from "../components/ButtonLink";

function ReservaCompletada() {
    return ( 
        <>
            <Header />
            <div className="CenterDiv gap-3 rounded-2xl">
                <Check className="size-24 text-white bg-amber-500 p-5 rounded-full"/>
                <h1 className="font-bold text-5xl">Reserva Hecha Exitosamente.</h1>
                <p>Te llegara al correo el ticket y la factura</p>
                <ButtonLink Path='/' Text='Volver a Reservar' />
            </div>        
        </> 
    );
}

export default ReservaCompletada;