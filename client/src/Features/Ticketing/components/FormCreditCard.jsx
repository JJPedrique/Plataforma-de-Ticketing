import { useState } from "react";
import { CreditCard } from "lucide-react";

const CARD_CONFIGS = {
  visa: {
    label: "Visa",
    numberPlaceholder: "4123 4567 8901 2345",
    numberMaxLength: 19,
    // Empieza por 4 y tiene 13 o 16 dígitos (permite espacios o guiones)
    numberPattern: "^4[0-9]{12}(?:[0-9]{3})?$",
    numberTitle: "Visa debe iniciar con 4 y tener 13 o 16 dígitos",
    cvcLabel: "CVV",
    cvcPlaceholder: "123",
    cvcMaxLength: 3,
    cvcPattern: "[0-9]{3}",
    cvcTitle: "Código de seguridad de 3 dígitos (reverso de la tarjeta)",
  },
  mastercard: {
    label: "Mastercard",
    numberPlaceholder: "5412 3456 7890 1234",
    numberMaxLength: 19,
    // Empieza por 51-55 o 2221-2720 y tiene 16 dígitos
    numberPattern: "^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$",
    numberTitle: "Mastercard debe iniciar con 51-55 o 2221-2720 y tener 16 dígitos",
    cvcLabel: "CVC",
    cvcPlaceholder: "123",
    cvcMaxLength: 3,
    cvcPattern: "[0-9]{3}",
    cvcTitle: "Código de seguridad de 3 dígitos (reverso de la tarjeta)",
  },
  amex: {
    label: "Amex",
    numberPlaceholder: "3712 345678 90123",
    numberMaxLength: 17,
    // Empieza por 34 o 37 y tiene 15 dígitos
    numberPattern: "^3[47][0-9]{13}$",
    numberTitle: "American Express debe iniciar con 34 o 37 y tener 15 dígitos",
    cvcLabel: "CID",
    cvcPlaceholder: "1234",
    cvcMaxLength: 4,
    cvcPattern: "[0-9]{4}",
    cvcTitle: "Código de seguridad de 4 dígitos (frente de la tarjeta)",
  },
  other: {
    label: "Otra",
    numberPlaceholder: "1234 5678 9012 3456",
    numberMaxLength: 23,
    numberPattern: "",
    numberTitle: "Ingresa un número de tarjeta válido de 13 a 19 dígitos",
    cvcLabel: "CVC",
    cvcPlaceholder: "123",
    cvcMaxLength: 4,
    cvcPattern: "[0-9]{3,4}",
    cvcTitle: "Código de seguridad de 3 o 4 dígitos",
  },
};

function FormCreditCard({ onReservar }) {
  const [selectedCard, setSelectedCard] = useState("visa");
  const config = CARD_CONFIGS[selectedCard];

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
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de tarjeta
        </span>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(CARD_CONFIGS).map(([key, card]) => {
            const isSelected = selectedCard === key;
            return (
              <button
                key={key}
                type="button" // Importante para no enviar el formulario al hacer clic
                onClick={() => setSelectedCard(key)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {card.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nombre en la tarjeta */}
      <div>
        <label htmlFor="cc-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre en la tarjeta
        </label>
        <input
          type="text"
          id="cc-name"
          name="cc_name"
          autoComplete="cc-name"
          placeholder="Juan Pérez"
          pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .\-]{2,50}"
          title="Ingresa solo letras y espacios (entre 2 y 50 caracteres)"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
        />
      </div>

      {/* Número de tarjeta */}
      <div>
        <label htmlFor="cc-number" className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta ({config.label})
        </label>
        <div className="relative flex items-center gap-2">
          <CreditCard className="text-gray-400 shrink-0" />
          <input
            type="text"
            id="cc-number"
            name="cc_number"
            autoComplete="cc-number"
            placeholder={config.numberPlaceholder}
            maxLength={config.numberMaxLength}
            pattern={config.numberPattern}
            title={config.numberTitle}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors tracking-wide"
          />
        </div>
      </div>

      {/* Vencimiento y CVC */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="cc-exp" className="block text-sm font-medium text-gray-700 mb-1">
            Vencimiento
          </label>
          <input
            type="text"
            id="cc-exp"
            name="cc_exp"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            maxLength={5}
            pattern="(0[1-9]|1[0-2])/[0-9]{2}"
            title="Formato válido: MM/AA (mes del 01 al 12)"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="cc-csc" className="block text-sm font-medium text-gray-700 mb-1">
            {config.cvcLabel}
          </label>
          <input
            type="text"
            id="cc-csc"
            name="cc_csc"
            autoComplete="cc-csc"
            placeholder={config.cvcPlaceholder}
            maxLength={config.cvcMaxLength}
            pattern={config.cvcPattern}
            title={config.cvcTitle}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>
      </div>

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