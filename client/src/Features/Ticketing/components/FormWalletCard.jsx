import { useState } from "react";

function FormWalletCard({ onReservar }) {
  const [form, setForm] = useState({
    paypalEmail: "",
  });

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
    <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Monedero Digital</h2>
        <p className="text-sm text-gray-500">Selecciona tu plataforma de pago preferida.</p>
      </div>

      <div className="animate-fade-in">
        <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Correo asociado a PayPal
        </label>
        <input
          id="paypalEmail"
          type="email"
          value={form.paypalEmail}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
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

export default FormWalletCard;