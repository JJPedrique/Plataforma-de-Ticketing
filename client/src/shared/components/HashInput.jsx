import { Hash } from "lucide-react";
import { useState } from "react";
import { HASH_MAX_LENGTH, HASH_MIN_LENGTH, HASH_PATTERN } from '../validation/rules';

function HashInput({ label = "Hash de transacción", setValue, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleChange = (e) => {
    const clean = e.target.value.replace(/\s+/g, ' ').trim();
    setInputValue(clean);
    setValue?.(clean);
  };

  return (
    <div>
      <label htmlFor="hash" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Hash className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange} type="text" id="hash" name="hash"
          pattern={HASH_PATTERN} maxLength={HASH_MAX_LENGTH} minLength={HASH_MIN_LENGTH} required
          placeholder="e3b0c4...b855"
          title="Debe ser un hash hexadecimal válido (entre 32 y 64 caracteres: 0-9, a-f)"
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-mono"
          value={inputValue}
        />
      </div>
    </div>
  );
}

export default HashInput;
