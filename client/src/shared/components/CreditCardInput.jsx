import { CreditCard } from "lucide-react";
import { useState } from "react";
import { getCardConfig } from '../validation/rules';

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

function CreditCardInput({ label, setValue, initialValue = ""}) {
  const config = getCardConfig().number;

  const [inputValue, setInputValue] = useState(() =>
    formatCardNumber(initialValue)
  );

  const handleChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
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