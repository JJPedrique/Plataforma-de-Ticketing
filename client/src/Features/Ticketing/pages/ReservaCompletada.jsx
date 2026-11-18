import { CheckCircle, Mail, Download } from "lucide-react";
import { Link } from "react-router-dom";

function ReservaCompletada({Repetir}) {
    return ( 
        <>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"></div>
                    <CheckCircle className="relative size-24 text-white bg-linear-to-br from-green-500 to-green-600 p-5 rounded-full shadow-lg shadow-green-500/30" />
                </div>
                <h1 className="font-bold text-3xl md:text-5xl tracking-tight text-gray-900 mb-3">Reserva realizada con éxito</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md">Tu compra ha sido procesada correctamente</p>
                
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-md w-full mb-6">
                    <div className="flex items-center gap-3 mb-4 text-left">
                        <Mail className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="font-medium text-gray-900">Confirmación enviada</p>
                            <p className="text-sm text-gray-600">Te llegará al correo electrónico el ticket y la factura</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                        <Download className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="font-medium text-gray-900">Boletos disponibles</p>
                            <p className="text-sm text-gray-600">Puedes descargar tus boletos desde tu correo</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/Inicio" 
                        className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                        Volver al inicio
                    </Link>
                    <Link to="/Ticketing" reloadDocument
                        className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Comprar más boletos
                    </Link>
                </div>
            </div>        
        </> 
    );
}

export default ReservaCompletada;