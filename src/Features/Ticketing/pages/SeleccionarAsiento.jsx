import { useState } from 'react';
import Steps from '../components/Steps';
import Canvas from '../components/Canvas';
import { Armchair } from 'lucide-react';

function SeleccionarAsiento({seats, onClick}) {
    function SelectSeat(seat){
        if(seat.status==="Ocupado"){return;}
        if(seat.status==="Disponible"){seat.status="Seleccionado";            
            onClick(seat,true);
        }else{seat.status="Disponible";
            onClick(seat,false);
        }
    }
 
    return ( 
    <>
        <Steps Number='2' Text='Elige tu asiento.' subText='Selecciona los asientos que deseas reservar' />
 
        <div className='grid md:grid-cols-2 gap-4'>
        
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
                
                <Canvas onClick={(i) => SelectSeat(i)}/>

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
                            {seats.map((i) => (
                                <div key={i.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg w-full shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                            <Armchair className="size-6" />
                                        </div>
                                        <span className="text-sm text-gray-900">
                                            Fila {i.y} - Asiento {i.x}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </> );
}

export default SeleccionarAsiento;