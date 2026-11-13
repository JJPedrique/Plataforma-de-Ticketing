import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";
import { authService } from "../../InicioSesion/services/authService";
import NextStep from "../components/NextStep";
import { TicketingContext } from "../Context/TicketingContext";
import { AddOrder, AddTikets, UpdateOrden,  } from "../services/Pagos";
import { BDD } from "../../../Data/Mock_v2";

function Ticketing() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const session = authService.getSession();
    const [idOrder,setIdOrder] = useState(null);

    useEffect(() => {
        if (!session) {navigate('/IniciarSesion');}
    }, [session, navigate]);
    if (!session) {return null;}

    const { event, seats,totalAmount, setReset } = useContext(TicketingContext);


    function Reservar(){
        console.log("Rerservado");
        const orderID = AddOrder({user_id:null,total_amount:totalAmount.total,status:"pending",payMethod_id:null,payMethod_ref:null,created_at:  Date.now()});
        setIdOrder(orderID);
        seats.map(s => AddTikets({event_id:event.id,order_id:orderID,seat_id:s.seat.id}));
        setTab(3);
    }

    function Completar(){
        console.log("Completado");
        UpdateOrden(idOrder,"completed");
        setReset(); setTab(4);
    }

    function Cancelar(){
        console.log("Cancelado");
        UpdateOrden(idOrder,"cancelled");    
        setTab(2);
    }

    function Reset(){
        setReset();
        setTab(1);
    }

    return ( 
        <>   
            {tab != 4 && 
            <div className={`z-10 w-full items-center p-5 flex ${tab == 1 ? 'justify-end' : 'justify-between'}`}>
                {tab == 1 && <NextStep isDisabled={!event} LoR={false} Text={"Siguiente"} onClick={() => setTab(2)}/>}
                {tab == 2 && <>
                    <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(1)}/>
                    <NextStep isDisabled={seats.length === 0} LoR={false} Text={"Siguiente"} onClick={Reservar}/>
                </>}
                {tab == 3 && <NextStep LoR={true} Text={"Anterior"} onClick={Cancelar}/>}                
            </div>}

            <div className="w-full">{
                tab == 1? (<SeleccionarEvento/>):
                tab == 2? ( <SeleccionarAsiento/>):
                tab == 3? (<RealizarPago onReservar={Completar}/>):
                (<ReservaCompletada Repetir={Reset}/>)}
            </div>
        </>
    );
}

export default Ticketing;