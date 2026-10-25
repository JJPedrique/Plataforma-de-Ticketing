import { ImageOff } from 'lucide-react';
import Steps from '../components/Steps';

function SeleccionarAsiento() {
    return ( 
    <>
        <Steps Number='2' Text='Elige tu Asiento.' />
        
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <ImageOff className="mb-2 h-10 w-10 stroke-[1.5]" />
            <span className="text-xs font-medium">Sin imagen disponible</span>
        </div>

    </> );
}

export default SeleccionarAsiento;