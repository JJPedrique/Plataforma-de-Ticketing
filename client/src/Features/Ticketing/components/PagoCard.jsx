import { useContext } from "react";
import { TicketingContext } from "../Context/TicketingContext";
import { Wallet } from "lucide-react";

function PagoCard({Data}) {
    const { pay, onPayChange } = useContext(TicketingContext);
    
    return ( <>
            <button
            onClick={()=>onPayChange(Data)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
            pay === Data ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'}`}>
            <div className={`p-2.5 rounded-lg ${
            pay === Data ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
            <Wallet className={`h-5 w-5 ${pay === Data ? 'text-orange-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-900">{Data.name}</p>
                <p className="text-sm text-gray-500">{Data.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pay === Data ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
            {pay === Data  && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
        </button> 
    </> );
}

export default PagoCard;