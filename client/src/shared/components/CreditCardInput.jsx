import { CreditCard } from "lucide-react";
import { useState } from "react";

const CARD_CONFIGS = {
    Visa: {
        placeholder: "4123 4567 8901 2345",
        maxLength: 19,
        pattern: "^4[0-9]{3}\\s?[0-9]{4}\\s?[0-9]{4}\\s?[0-9](?:[0-9]{3})?$",
        title: "Visa debe iniciar con 4 y tener 13 o 16 dígitos",
    },
    Mastercard: {
        placeholder: "5412 3456 7890 1234",
        maxLength: 19,
        pattern: "^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)\\s?[0-9]{4}\\s?[0-9]{4}\\s?[0-9]{4}$",
        title: "Mastercard debe iniciar con 51-55 o 2221-2720 y tener 16 dígitos",
    },
    Amex: {
        placeholder: "3712 345678 90123",
        maxLength: 17,
        pattern: "^3[47][0-9]{2}\\s?[0-9]{6}\\s?[0-9]{5}$",
        title: "American Express debe iniciar con 34 o 37 y tener 15 dígitos",
    },
    Other: {
        placeholder: "1234 5678 9012 3456",
        maxLength: 23,
        pattern: "^(?:[0-9]\\s?){12,18}[0-9]$",
        title: "Ingresa un número de tarjeta válido de 13 a 19 dígitos",
    },
};

const formatCardNumber = (value, cardType) => {
  const digits = value.replace(/\D/g, "");

  if (cardType === "amex") {
    const limited = digits.slice(0, 15);
    return [limited.slice(0, 4), limited.slice(4, 10), limited.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }

  const maxDigits = cardType === "other" ? 19 : 16;
  const limited = digits.slice(0, maxDigits);
  return limited.replace(/(.{4})/g, "$1 ").trim();
};

function CreditCardInput({ type = "other", label, setValue, initialValue = ""}) {
  const normalizedType = type?.toLowerCase() || "other";
  const config = CARD_CONFIGS[normalizedType] || CARD_CONFIGS.Other;

  const [inputValue, setInputValue] = useState(() =>
    formatCardNumber(initialValue, normalizedType)
  );

  const handleChange = (e) => {
    const formatted = formatCardNumber(e.target.value, normalizedType);
    const rawDigits = formatted.replace(/\s/g, "");

    setInputValue(formatted);
    setValue?.(rawDigits);
  };

  return (
    <div>
      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CreditCard className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input id="cardNumber" onChange={handleChange} name="cardNumber" type="text" inputMode="numeric" autoComplete="cc-number" required
          placeholder={config.placeholder}
          pattern={config.pattern}
          maxLength={config.maxLength}
          title={config.title}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          value={inputValue}
        />
      </div>
    </div>
  );
}

export default CreditCardInput;