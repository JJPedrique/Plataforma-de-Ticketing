import { Lock } from "lucide-react";
import { useState } from "react";
import { getCardConfig } from '../validation/rules';

const sanitizeCvc = (value, maxLength) =>
  String(value).replace(/\D/g, "").slice(0, maxLength);

function CvcInput({ setValue, initialValue = "" }) {
  const config = getCardConfig().cvc;

  const [inputValue, setInputValue] = useState(() =>
    sanitizeCvc(initialValue, config.maxLength)
  );

  // Recorta automáticamente si la franquicia cambia de 4 dígitos (Amex) a 3 (Visa/Mastercard)
  const displayValue = inputValue.slice(0, config.maxLength);

  const handleChange = (e) => {
    const cleanDigits = sanitizeCvc(e.target.value, config.maxLength);
    setInputValue(cleanDigits);
    setValue?.(cleanDigits);
  };

  return (
    <div>
      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1.5">
        {config.label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input id="cvc" name="cvc" type="text" inputMode="numeric" autoComplete="cc-csc" onChange={handleChange} required
          placeholder={config.placeholder}
          pattern={config.pattern}
          maxLength={config.maxLength}
          title={config.title}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          value={displayValue}/>
      </div>
    </div>
  );
}

export default CvcInput;