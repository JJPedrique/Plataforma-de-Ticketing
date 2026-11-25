import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { PASSWORD_MAX_LENGTH, PASSWORD_PATTERN, PASSWORD_TITLE } from '../validation/rules';

function PasswordInput({ label = "Contraseña", setValue, initialValue= "", id="password", name="password", placeholder="Ingresa tu contraseña", required=true}) {
  const [inputValue, setInputValue] =useState(initialValue);
  const handleChange = (e) => {
    setInputValue(e.target.value);
    setValue?.(e.target.value);
  };

  const [isShowPassword, setIsShowPassword] = useState(false);
        
    return ( 
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange}
        id={id} name={name} placeholder={placeholder} required={required} type={isShowPassword ? 'text' : "password"}
        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
        pattern={PASSWORD_PATTERN}
        maxLength={PASSWORD_MAX_LENGTH}
        title={PASSWORD_TITLE}
        value={inputValue}/>
        <button
            type="button"
            onClick={() => setIsShowPassword(prev=>!prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isShowPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {isShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
      </div>
    </div> );
}

export default PasswordInput;
