import { useState } from "react";
import CreditCardInput from "../../../shared/components/CreditCardInput";
import CvcInput from "../../../shared/components/CvcInput";
import SelectInput from "../../../shared/components/SelectInput";
import TextInput from "../../../shared/components/TextInput";
import VencimientoInput from "../../../shared/components/VencimientoInput";

function FormCreditCard({ onReservar }) {
  const [selectedCard, setSelectedCard] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onReservar();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Pago con Tarjeta</h2>
        <p className="text-sm text-gray-500">
          Selecciona el tipo e ingresa los datos de tu tarjeta.
        </p>
      </div>

      {/* Selector de franquicia */}
      <SelectInput label="Selecciona un tipo de Tajerta" values={["Visa","Mastercard","Amex","Other"]} setValue={setSelectedCard}/>
      <TextInput label="Nombre de la tarjeta"/>

      {selectedCard && <>
        <CreditCardInput type={selectedCard} label={selectedCard}/>
        <div className="grid grid-cols-2 gap-4">
          <CvcInput type={selectedCard}/>
          <VencimientoInput label="Vencimiento"/>
        </div>
      </>}

      <button
        className="w-full mt-3 py-3 px-4 rounded-xl font-semibold transition-all bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        type="submit"
      >
        Continuar con el pago
      </button>
    </form>
  );
}

export default FormCreditCard;