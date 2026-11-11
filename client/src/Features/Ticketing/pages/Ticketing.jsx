import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";
import { authService } from "../../InicioSesion/services/authService";
import NextStep from "../components/NextStep";
import { TicketingContext } from "../Context/TicketingContext";

function Ticketing() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const session = authService.getSession();

    useEffect(() => {
        if (!session) {navigate('/IniciarSesion');}
    }, [session, navigate]);
    if (!session) {return null;}

    const { event, seats, pay } = useContext(TicketingContext);

    return ( 
        <>   
            {tab != 4 && 
            <div className={`z-10 w-full items-center p-5 flex ${tab == 1 ? 'justify-end' : 'justify-between'}`}>
                {tab == 1 && <NextStep isDisabled={!event} LoR={false} Text={"Siguiente"} onClick={() => setTab(tab != 4 ? tab + 1 : tab)}/>}
                {tab == 2 && <>
                    <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(tab != 1 ? tab - 1 : tab)}/>
                    <NextStep isDisabled={seats.length === 0} LoR={false} Text={"Siguiente"} onClick={() => setTab(tab != 4 ? tab + 1 : tab)}/>
                </>}
                {tab == 3 && <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(tab != 1 ? tab - 1 : tab)}/>}                
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