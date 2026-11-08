function MetodoPagoCard({ img, texto }) {
  return (
    <button className="flex items-center justify-between w-full max-w-sm px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-500 transition-all duration-200 ease-in-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
      <p className="text-sm font-medium text-gray-700">Pagar con {texto}</p>
      <img src={img} alt={texto} className="h-6 w-auto object-contain" />
    </button>
  );
}

export default MetodoPagoCard;