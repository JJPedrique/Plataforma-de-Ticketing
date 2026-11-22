import { useId, useState } from "react";

function SelectInput({ label, values = [], setValue, initialValue = ""}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const selectId = useId();

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setValue(newValue);
  };

  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select id={selectId} value={inputValue} onChange={handleChange} required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-white text-gray-700">
          <option value="">-- Seleccione --</option>
          {values.map((v) => (  <option key={v} value={v}> {v} </option>  ))}
        </select>
      </div>
    </div>
  );
}

export default SelectInput;