function FormWalletCard() {
  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Monedero Digital</h2>
        <p className="text-sm text-gray-500">Selecciona tu plataforma de pago preferida.</p>
      </div>
    
      <div className="animate-fade-in">
        <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">Correo asociado a PayPal</label>
        <input 
          id="paypalEmail" 
          type="email" 
          placeholder="correo@ejemplo.com" 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
        />
      </div>
    </form>
  );
}

export default FormWalletCard;