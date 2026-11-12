import { useState } from "react";

function FormCreditCard({ onReservar }) {
  const [form, setForm] = useState({cardName: "",cardNumber: "",expiryDate: "",cvc: "",});

  const isAllFilled = Object.values(form).every((value) => value.trim().length > 0);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleAction = () => {
    if (!isAllFilled) return;
    onReservar?.();
  };

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pago con Tarjeta</h2>
        <p className="text-sm text-gray-500">Ingresa los datos de tu tarjeta de crédito o débito.</p>
      </div>

      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre en la tarjeta
        </label>
        <input
          id="cardName"
          type="text"
          value={form.cardName}
          onChange={handleChange}
          placeholder="Ej. Juan Pérez"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            maxLength={19}
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors tracking-wide"
          />
          <svg
            className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Vencimiento
          </label>
          <input
            id="expiryDate"
            type="text"
            maxLength={5}
            value={form.expiryDate}
            onChange={handleChange}
            placeholder="MM/AA"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <input
            id="cvc"
            type="password"
            maxLength={4}
            value={form.cvc}
            onChange={handleChange}
            placeholder="•••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAction}
        disabled={!isAllFilled}
        className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormCreditCard;