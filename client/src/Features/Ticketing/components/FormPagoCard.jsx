function MetodoDePagoCard() {
    return ( 
    <>
        <div className="mb-6">
          <Steps Number='3' Text='Completar pago' />
          <p className="ml-16 -mt-4 text-sm text-gray-600">Ingresa los datos para procesar tu pago</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div>
                <h2 className='font-semibold text-gray-900'>Formulario de pago</h2>
                <p className="text-sm text-gray-600">Método: ______</p>
                </div>
            </div>
            <form className="p-6 space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de tarjeta</label>
                <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    type="text" placeholder="1234 5678 9012 3456" required/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de vencimiento</label>
                    <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    type="text" placeholder="MM/AA" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    type="text" placeholder="123" required/>
                </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del titular</label>
                    <input className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    type="text" placeholder="Como aparece en la tarjeta" required/>
                </div>
            </form>
        </div>
    </>);
}

export default MetodoDePagoCard;