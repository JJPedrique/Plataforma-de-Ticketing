import { useState, useContext, useEffect } from "react";
import SeleccionarEvento from "./SeleccionarEvento";
import SeleccionarAsiento from "./SeleccionarAsiento";
import RealizarPago from "./RealizarPago";
import ReservaCompletada from "./ReservaCompletada";
import NextStep from "../components/NextStep";
import { TicketingContext } from "../Context/TicketingContext";
import { Clock } from "lucide-react";
import { useTimer } from "../hooks/Timer";
import Modal from "../../../shared/components/Modal";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/Context/AuthContext";
import { ticketingService } from "../services/Ticketing";

function Ticketing() {
    const {user} = useAuth();
    const { order, event, seats, pay, totalAmount, setOrder } = useContext(TicketingContext);
    const { seconds, isRunning, formatTime } = useTimer(5*60,true);
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [tab, setTab] = useState(1);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try {
            setLoading(true);
            const data = await ticketingService.create({user_id: user.id});
            setOrder(data);
        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {setLoading(false);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};
    }, []);    

    function RealizarCompra(){
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try {
            setLoading(true);
            await ticketingService.update(order.id,{pay_method_id: pay.id, total_amount: totalAmount.total,pay_methods_ref: pay.pay_methods_ref, status: "COMPLETED"});
        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {
            setLoading(false);
            setTab(4);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};        
    }
  
    return ( 
        <div>   
            {tab !== 4 &&
            <div className="bg-background/85 backdrop-blur fixed left-0 top-18 z-50 w-full flex justify-center">
                <div className="w-10/12 p-5 grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        {tab == 2 && ( <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(1)} /> )}
                        {tab == 3 && ( <NextStep LoR={true} Text={"Anterior"} onClick={() => setTab(2)}/> )}
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <Clock className="text-orange-500" />
                        <span className="text-orange-500 font-monospace">{formatTime(seconds)}</span>
                    </div>

                    <div className="flex justify-end">
                        {tab == 1 && ( <NextStep isDisabled={!event} LoR={false} Text={"Siguiente"} onClick={() => setTab(2)} /> )}
                        {tab == 2 && ( <NextStep isDisabled={seats.length === 0} LoR={false} Text={"Siguiente"} onClick={() => setTab(3)} /> )}
                    </div>
                </div>
            </div>}

            <div className="w-full pt-3">{
                tab == 1? (<SeleccionarEvento/>):
                tab == 2? ( <SeleccionarAsiento/>):
                tab == 3? (<RealizarPago onReservar={()=>RealizarCompra()}/>):
                (<ReservaCompletada/>)}
            </div>

            {!isRunning && tab !== 4 &&      
                <Modal isOpen={() => setIsModalOpen(true)} title="Tiempo Expirado" 
                children={              
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <Clock/>
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900"> Se te acabó el tiempo </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                El tiempo reservado para tus boletos ha finalizado. Regresa al inicio para seleccionar tus entradas nuevamente.
                            </p>
                        </div>
                    </div>}
                footer={
                    <Link to="/Ticketing" reloadDocument className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:w-auto">
                    Volver a Comprar Boletos
                    </Link>}
                >
                </Modal>
            }
        </div>
    );
}

export default Ticketing;