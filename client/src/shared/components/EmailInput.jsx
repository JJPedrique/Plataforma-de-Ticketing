import { Mail } from "lucide-react";
import { useState } from "react";
import { EMAIL_MAX_LENGTH, EMAIL_PATTERN, sanitizeEmail } from '../validation/rules';

function EmailInput({ label = "Correo electrónico", setValue, initialValue= "", id="email", name="email", readOnly=false}) {
  const [inputValue, setInputValue] =useState(initialValue);
  const handleChange = (e) => {
    if (readOnly) return;
    const clean = sanitizeEmail(e.target.value);
    setInputValue(clean); 
    setValue?.(clean);
  };  

  return ( 
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange} maxLength={EMAIL_MAX_LENGTH} pattern={EMAIL_PATTERN}
        type="email" id={id} name={name} placeholder="tu@correo.com" required={!readOnly} readOnly={readOnly}
        className={readOnly
          ? "w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-default"
          : "w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"}
        value={inputValue}/>
      </div>
    </div> );
}

export default EmailInput;
