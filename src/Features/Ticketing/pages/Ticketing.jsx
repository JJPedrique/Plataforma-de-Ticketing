import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";
import { authService } from "../../InicioSesion/services/authService";

function Ticketing() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const session = authService.getSession();

    useEffect(() => {
        if (!session) {
            navigate('/IniciarSesion');
        }
    }, [session, navigate]);

    if (!session) {
        return null;
    }

    return ( 
        <>
            {tab != 4 && 
            <div className={`w-full items-center p-5 flex ${tab == 1 ? 'justify-end' : 'justify-between'}`}>
                {tab != 1 && 
                <button className="flex gap-2" type="button" onClick={() => setTab(tab != 1 ? tab - 1 : tab)}>
                    <MoveLeft className="text-orange-500 font-bold"/>
                    <span className="text-orange-500 font-bold">Anterior</span>
                </button>}
                {tab != 3 && (
                <button className="flex gap-2" type="button" onClick={() => setTab(tab != 4 ? tab + 1 : tab)}>
                    <span className="text-orange-500 font-bold">Siguiente</span>
                    <MoveRight className="text-orange-500 font-bold"/>
                </button>
                )}
            </div>}

            <div className="w-full">
                {tab == 1? (<SeleccionarEvento/>):
                tab == 2? ( <SeleccionarAsiento/>):
                tab == 3? (<RealizarPago onReservar={() => setTab(4)} />):
                (<ReservaCompletada />)}
            </div>
        </> 
    );
}

export default Ticketing;