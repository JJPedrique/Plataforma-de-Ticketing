import { IdCard } from "lucide-react";
import { useState } from "react";

function CedulaInput({ label = "Cédula de Identidad", setValue, initialValue= ""}) {
  const [inputValue, setInputValue] =useState(initialValue);
  const handleChange = (e) => {
    const clean = e.target.value.toUpperCase().replace(/[^VE0-9-]/g, "").replace(/\s+/g, '').trim();
    setInputValue(clean); 
    setValue(clean);
  };  

  return (
    <div>
      <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IdCard className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange} type="text" id="cedula" name="cedula" placeholder="V-12345678" required pattern="^[VEve]-?\d{6,8}$" minLength="7" maxLength="10"
          title="Formato válido: V-12345678 o E-12345678 (entre 6 y 8 dígitos)"
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors uppercase"
            value={inputValue}/>
      </div>
    </div>
  );
}

export default CedulaInput;