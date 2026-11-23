function FormEfectivoCard({ onReservar }) {
  const handleSubmit = (e) => {
      e.preventDefault();
      onReservar();
  };

  return (
    <form className="space-y-2" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Efectivo en Taquilla</h2>
        <p className="text-sm text-gray-500">Confirma la reserva y paga en efectivo al retirar tus entradas en la taquilla del recinto.</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">Presenta tu comprobante de compra y el código de referencia al retirar las entradas.</p>
      </div>

      <button className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit">
        Continuar con la reserva
      </button>
    </form>
  );
}

export default FormEfectivoCard;
