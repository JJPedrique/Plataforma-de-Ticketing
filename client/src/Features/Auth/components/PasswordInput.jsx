import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

function PasswordInput({label, setValue}) {
  const [inputValue, setInputValue] =useState("");
  const handleChange = (e) => {setInputValue(e.target.value.trim());setValue(inputValue)};  
  
  const [isShowPassword, setIsShowPassword] = useState(false);
        
    return ( 
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input onChange={handleChange}
        id="password" name="password" placeholder="Ingresa tu contraseña" required type={isShowPassword ? 'text' : "password"}
        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
        pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$"
        title="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo"
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