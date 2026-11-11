function FormCreditCard() {
    return (
        <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Pago con Tarjeta</h2>
                <p className="text-sm text-gray-500">Ingresa los datos de tu tarjeta de crédito o débito.</p>
            </div>
            
            <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input 
                id="cardName" 
                type="text" 
                placeholder="Ej. Juan Pérez" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
            </div>
            
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <div className="relative">
                <input 
                    id="cardNumber" 
                    type="text" 
                    maxLength="19" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors tracking-wide" 
                />
                <svg className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="w-1/2">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                <input 
                    id="expiryDate" 
                    type="text" 
                    placeholder="MM/AA" 
                    maxLength="5" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
                </div>
                <div className="w-1/2">
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input 
                    id="cvc" 
                    type="password" 
                    placeholder="•••" 
                    maxLength="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
                </div>
            </div>
        </form>
    );
}

export default FormCreditCard;