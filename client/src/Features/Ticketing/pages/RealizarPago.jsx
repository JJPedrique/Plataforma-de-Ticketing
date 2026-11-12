import { useState, useContext } from 'react';
import { CreditCard, Ticket, } from 'lucide-react';
import Steps from '../components/Steps';
import EventoCard from '../components/EventoCard';
import SillasCard from '../components/SillaCard';
import { TicketingContext } from '../Context/TicketingContext';
import PagoCard from '../components/PagoCard';
import { GetPagosAll } from '../services/Pagos';
import Modal from '../../../shared/components/Modal';
import FormCreditCard from '../components/FormCreditCard';
import FormCriptoCard from '../components/FormCriptoCard';
import FormWalletCard from '../components/FormWalletCard';

function RealizarPago({ onReservar }) {
  const [payMedthods,setPayMethods] = useState(GetPagosAll());
  const {event,seats,pay,onPayChange} = useContext(TicketingContext);
 
  const subtotal = seats.reduce((acc, a) => acc + a.price, 0);
  const comision = subtotal*0.01;
  const total = subtotal + comision;

  const [isModalOpen, setIsModalOpen] = useState(false);  

  function RealizarPago(Pay){
    onPayChange(Pay);
    setIsModalOpen(true);
  }

  function CancelarPago(){
    onPayChange(null);
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="mb-6">
        <Steps Number='3' Text='Realizar pago' />
        <p className="ml-16 -mt-4 text-sm text-gray-600">Selecciona tu método de pago y confirma tu compra</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        <div className="lg:col-span-1 space-y-4">
          <EventoCard Data={event} isDisabled={true}/>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className='font-semibold text-gray-900 flex items-center gap-2'>
                <Ticket className="h-4 w-4 text-orange-500" /> Asientos seleccionados
              </h2>
            </div>
            <div className="p-4">
              <div className={`${seats.length > 3 ? 'max-h-65 overflow-y-auto pr-1' : ''} space-y-2 mb-4`}>
                {seats.map((i) => (<SillasCard key={i.seat.id} Data={i}/>))}
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Comisión</span><span>${comision.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total a pagar</span><span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-gray-100">
              <h2 className='font-semibold text-gray-900 flex items-center gap-2'>
                <CreditCard className="h-4 w-4 text-orange-500" />Método de pago
              </h2>
              <p className="text-sm text-gray-600 mt-1">Selecciona el método de pago de tu preferencia</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {payMedthods.map(method => <PagoCard key={method.id} Data={method} onClick={()=>RealizarPago(method)}/>)}
              </div>
            </div>
            <div className="p-4 flex justify-center w-full">
              <span className='border-t w-75 flex justify-center text-stone-300'>
                more comming soon...
              </span>
            </div>
          </div>
        </div>
      </div>


      <Modal isOpen={isModalOpen} onClose={()=>CancelarPago()}
        title={pay?.name} 
        
        children={
          pay?.name === "Tarjetas de Crédito y Débito" ? (<FormCreditCard onReservar={onReservar}/>) :
          pay?.name === "Criptomonedas y Monedas Estables (Stablecoins)" ? (<FormCriptoCard onReservar={onReservar}/>) :         
          pay?.name === "Monederos Digitales y Billeteras (e-Wallets)" ? (<FormWalletCard onReservar={onReservar}/>) :         
          (<h1>Yahany Fia</h1>)}/>       
    </>
  );
}

export default RealizarPago;