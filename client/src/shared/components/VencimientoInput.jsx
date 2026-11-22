import { Calendar} from "lucide-react";
import { useState } from "react";

function VencimientoInput({label, setValue, initialValue=""}) {
  const [inputValue, setInputValue] =useState(initialValue);
  const handleChange = (e) => {
    const clean = e.target.value.replace(/\s+/g, ' ').trim();
    setInputValue(clean); 
    setValue(clean);
  };  

  return ( 
    <div>
      <label htmlFor="cc-exp" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange} type="text" id="cc-exp" name="cc-exp" autoComplete="cc-exp" inputMode="numeric" placeholder="MM/AA" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" minLength={5} maxLength={5}
        title="Ingresa una fecha válida en formato MM/AA (ej. 08/28)"
        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
        value={inputValue}
        />
      </div>
    </div> );
}

export default VencimientoInput;