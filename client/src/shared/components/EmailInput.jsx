import { Mail } from "lucide-react";
import { useState } from "react";

function EmailInput({ label = "Cédula de Identidad", setValue, initialValue= ""}) {
  const [inputValue, setInputValue] =useState(initialValue);
  const handleChange = (e) => {
    const clean = e.target.value.replace(/\s+/g, '').trim();
    setInputValue(clean); 
    setValue(clean);
  };  

  return ( 
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange}
        type="email" id="email" name="email" placeholder="tu@correo.com" required
        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
        value={inputValue}/>
      </div>
    </div> );
}

export default EmailInput;