import { useState } from "react";
import HashInput from "../../../shared/components/HashInput";
import SelectInput from "../../../shared/components/SelectInput";

function FormCriptoCard({ onReservar }) {
  const handleSubmit = (e) => {
      e.preventDefault();
      onReservar();
  };

  const [copiado, setCopiado] = useState(false);
  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <form className="space-y-2" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Criptomonedas</h2>
        <p className="text-sm text-gray-500">Transfiere los fondos y verifica la transacción.</p>
      </div>
      
      <SelectInput label="Seleccionar Moneda y Red" values={["USDT (Red Tron / TRC-20)","USDT (Red Ethereum / ERC-20)","USDC (Red Polygon)","Bitcoin (BTC)"]}/>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center space-y-3">
        <p className="text-sm text-gray-600">Envía el monto exacto a la siguiente dirección:</p>
        <div className="relative group cursor-pointer">
          <p className="font-mono text-sm text-gray-800 break-all bg-gray-200/70 p-3 rounded-md border border-gray-300">
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </p>
          <button type="button" onClick={handleCopiar} 
            className="absolute inset-0 bg-orange-500 text-white text-sm flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            {copiado? "Copiado": "Copiar Dirección"}
          </button>
        </div>
      </div>

      <HashInput label="ID de Transacción (Hash)"/>  
    
      <button className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit">
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormCriptoCard;