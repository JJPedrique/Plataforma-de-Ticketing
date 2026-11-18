import { CreditCard } from "lucide-react";

function FormCreditCard({ onReservar }) {
  const handleSubmit = (e) => {
      e.preventDefault();
      onReservar();
  };

  return (
    <form className="space-y-2" onSubmit={(e) => handleSubmit(e)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pago con Tarjeta</h2>
        <p className="text-sm text-gray-500">Ingresa los datos de tu tarjeta de crédito o débito.</p>
      </div>

      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre en la tarjeta
        </label>
        <input type="text" id="cc-name" name="cc_name" autoComplete="cc-name" placeholder="Juan Pérez" pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{2,50}" title="Ingresa solo letras y espacios (entre 2 y 50 caracteres)" required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <div className="relative flex items-center gap-1">
          <CreditCard/>
          <input type="text" id="cc-number" name="cc_number" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength="23" pattern="(?:[0-9][ -]?){12,18}[0-9]" title="Ingresa un número de tarjeta válido de 13 a 19 dígitos" required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors tracking-wide"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Vencimiento
          </label>
          <input type="text" id="cc-exp" name="cc_exp" autoComplete="cc-exp" placeholder="MM/AA" maxLength="5" pattern="(0[1-9]|1[0-2])/[0-9]{2}" title="Formato válido: MM/AA (mes del 01 al 12)" required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <input type="text" id="cc-csc" name="cc_csc" autoComplete="cc-csc" placeholder="123" maxLength="4" pattern="[0-9]{3,4}" title="Código de seguridad de 3 o 4 dígitos" required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <button className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit">
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormCreditCard;