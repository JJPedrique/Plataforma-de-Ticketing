import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";
import { authService } from "../../InicioSesion/services/authService";
import NextStep from "../components/NextStep";

function Ticketing() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const session = authService.getSession();

    const [event,setEvent] = useState(null)
    const [seats,setSeats] = useState([])
    const [pay,setPay] = useState(null)

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
                {tab == 1 && <NextStep isDisabled={!event} LoR={false} Text={"Siguiente"} onClick={() => setTab(tab != 4 ? tab + 1 : tab)}/>}

                {tab == 2 && <>
                    <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(tab != 1 ? tab - 1 : tab)}/>
                    <NextStep isDisabled={seats.length!=0} LoR={false} Text={"Siguiente"} onClick={() => setTab(tab != 4 ? tab + 1 : tab)}/>
                </>}
                
                {tab == 3 && <>
                    <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(tab != 1 ? tab - 1 : tab)}/>
                </>}                
            </div>}

            <div className="w-full">
                {tab == 1? (<SeleccionarEvento selected={event} onClick={(i) => setEvent((event) => (event === i ? null : i))}/>):
                tab == 2? ( <SeleccionarAsiento/>):
                tab == 3? (<RealizarPago event={event} onReservar={() => setTab(4)} />):
                (<ReservaCompletada />)}
            </div>
        </> 
    );
}

export default Ticketing;