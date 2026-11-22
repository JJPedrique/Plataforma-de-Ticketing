import EmailInput from "../../../shared/components/EmailInput";
import SelectInput from "../../../shared/components/SelectInput";

function FormWalletCard({ onReservar }) {
  const handleSubmit = (e) => {
      e.preventDefault();
      onReservar();
  };

  return (
    <form className="space-y-2" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Monedero Digital</h2>
        <p className="text-sm text-gray-500">Selecciona tu plataforma de pago preferida.</p>
      </div>

      <SelectInput label="Seleccionar e-Wallet" values={["PayPal","Zelle","Zinli"]}/>

      <EmailInput label="Correo asociado al e-Wallet"/>

      <button className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit">
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormWalletCard;