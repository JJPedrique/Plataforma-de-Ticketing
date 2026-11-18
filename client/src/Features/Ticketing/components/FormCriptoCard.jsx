function FormCriptoCard({ onReservar }) {
  const handleSubmit = (e) => {
      e.preventDefault();
      onReservar();
  };

  return (
    <form className="space-y-2" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Criptomonedas</h2>
        <p className="text-sm text-gray-500">Transfiere los fondos y verifica la transacción.</p>
      </div>

      <div>
        <label htmlFor="cryptoNetwork" className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Moneda y Red
        </label>
        <select id="cryptoNetwork" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-white text-gray-700" required>
          <option value="">-- Seleccione --</option>
          <option value="usdt_trc20">USDT (Red Tron / TRC-20)</option>
          <option value="usdt_erc20">USDT (Red Ethereum / ERC-20)</option>
          <option value="usdc">USDC (Red Polygon)</option>
          <option value="btc">Bitcoin (BTC)</option>
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center space-y-3">
        <p className="text-sm text-gray-600">Envía el monto exacto a la siguiente dirección:</p>
        <div className="relative group cursor-pointer">
          <p className="font-mono text-sm text-gray-800 break-all bg-gray-200/70 p-3 rounded-md border border-gray-300">
            TXYZ1234567890ABCDEFGHIJKLMNOPQRST
          </p>
          <div className="absolute inset-0 bg-orange-500 text-white text-sm flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Copiar Dirección
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-1">
          ID de Transacción (Hash)
        </label>
        <input type="text" id="crypto-tx" name="crypto_tx" placeholder="0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" pattern="(0x)?[0-9a-fA-F]{64}" title="Hash hexadecimal de 64 caracteres (con o sin prefijo 0x)" required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">Requerido para verificar tu pago en la blockchain.</p>
      </div>

      <button className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit">
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormCriptoCard;