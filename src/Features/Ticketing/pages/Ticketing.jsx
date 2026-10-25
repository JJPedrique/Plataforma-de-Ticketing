import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";

function Ticketing() {
    const [tab,setTab] = useState(1)

    return ( 
        <>
            <div className="w-full">
                {tab == 1? (<SeleccionarEvento/>):
                tab == 2? ( <SeleccionarAsiento/>):
                tab == 3? (<RealizarPago />):
                (<ReservaCompletada />)}
            </div>
            
            {tab != 4 && 
            <div className={`w-full items-center p-3 flex ${tab == 1 ? 'justify-end' : 'justify-between'}`}>
                {tab != 1 && 
                <button className="flex gap-2" type="button" onClick={() => setTab(tab != 1 ? tab - 1 : tab)}>
                    <MoveLeft className="text-amber-500 font-bold"/>
                    <span className="text-amber-500 font-bold">Anterior</span>
                </button>}
                <button className="flex gap-2" type="button" onClick={() => setTab(tab != 4 ? tab + 1 : tab)}>
                    {tab==3? 
                    <span className="text-amber-500 font-extrabold"> Reservar</span> :
                    <span className="text-amber-500 font-bold"> Siguiente</span>}
                    <MoveRight className="text-amber-500 font-bold"/>
                </button>
            </div>}
        </> 
    );
}

export default Ticketing;