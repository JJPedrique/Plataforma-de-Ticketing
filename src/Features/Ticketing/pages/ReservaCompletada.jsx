import { Check } from "lucide-react";

function ReservaCompletada() {
    return ( 
        <>
            <div className="CenterDiv gap-3 rounded-2xl">
                <Check className="size-24 text-white bg-amber-500 p-5 rounded-full"/>
                <h1 className="font-bold text-5xl">Reserva Hecha Exitosamente.</h1>
                <p>Te llegara al correo el ticket y la factura</p>
            </div>        
        </> 
    );
}

export default ReservaCompletada;