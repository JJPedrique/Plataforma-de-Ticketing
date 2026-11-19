import Steps from '../components/Steps';
import Canvas from '../components/Canvas';
import { Armchair, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TicketingContext } from '../Context/TicketingContext';
import { ticketService, zoneService } from '../services/Asientos';
import SillasCard from '../components/SillaCard';
import Modal from '../../../shared/components/Modal';

function SeleccionarAsiento() {
    const {order,event,seats, setSeats} = useContext(TicketingContext);
    const [EventSeats,setEventSeats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  

    const [loading,setLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try {
            setLoading(true);
            const params = {venue_id: event.venue_id, event_id: event.id, order_id:order.id};
            const data = await zoneService.getAll(params,controller.signal);
            setEventSeats(data);
        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {setLoading(false);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};
    }, []);

    function Reservar(zone, seat){
        const controller = new AbortController();
        const timer = setTimeout(async () => {
        try { setLoading(true);

            const oldSeat = seats.find(s => s.seat.id === seat.id);
            if (oldSeat){
                await ticketService.delete(oldSeat.ticket,controller.signal);
                setSeats((prev) => prev.filter((s) => s.seat.id !== seat.id));
                return;
            }

            const newSeat = { event_id: event.id,  order_id: order.id, seat_id: seat.id}
            const data = await ticketService.reservar(newSeat,controller.signal);

            if(data===null){setIsModalOpen(true); return;}
            setSeats((prev) =>  [...prev, {ticket:data.id, zone: zone.name, price: zone.price, seat }]);

        } catch (error) {
            if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
        } finally {setLoading(false);}
        }, 400);

        return () => {clearTimeout(timer); controller.abort();};        
    }

    return ( 
    <>
        <Steps Number='2' Text='Elige tu asiento.' subText='Selecciona los asientos que deseas reservar' />
 
        <div className='grid lg:grid-cols-2 gap-4'>
        
            <div className=" bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-semibold text-gray-900">Mapa de asientos</h3>
                        <p className="text-sm text-gray-600">Selecciona tus asientos haciendo clic sobre ellos</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Disponible</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <span className="text-gray-600">Seleccionado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                            <span className="text-gray-600">Ocupado</span>
                        </div>
                        </div>
                    </div>
                </div>
                
                <Canvas Data={EventSeats} seats={seats} onSeatChange={Reservar}/>

            </div>
            
           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-96">
                {seats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-4 h-full">
                        <h3 className="font-semibold text-gray-900">No hay asientos registrados</h3>
                        <hr className="border text-stone-200 w-full" />
                        <p className="text-sm text-gray-600">Selecciona tus asientos haciendo clic sobre ellos</p>
                        <Armchair className="size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 p-4 h-full ">
                        <h3 className="font-semibold text-gray-900 sticky top-0 bg-white py-1 z-10">Asientos registrados</h3>
                         <hr className="border text-stone-200 w-full" />
                        <div className='flex flex-col gap-3 overflow-y-auto'>
                            {seats.map((i) => (<SillasCard key={i.seat.id} Data={i}/>))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <Modal isOpen={isModalOpen} title="Asiento Reservado" onClose={()=>setIsModalOpen(false)}
        children={              
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <X/>
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-900"> Lo sentimos... </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        El asiento ya esta reservado por otra persona
                    </p>
                </div>
            </div>}
        />
    </> );
}

export default SeleccionarAsiento;