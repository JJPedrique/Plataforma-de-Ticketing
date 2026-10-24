import './App.css'
import SeleccionarEvento from './Features/Ticketing/pages/SeleccionarEvento';
import EmitirPago from './Features/Ticketing/pages/EmitirPago';
import { Route, Routes } from 'react-router-dom';
import SeleccionarAsiento from './Features/Ticketing/pages/SeleccionarAsiento';
import EmpezarReservas from './Features/Ticketing/pages/EmpezarReservas';

function App() {

  return (

    <>
      <Routes>
        <Route path='/' element={<EmpezarReservas replace/>}/>
        <Route path='/Eventos' element={<SeleccionarEvento/>} />  
        <Route path='/Asientos' element={<SeleccionarAsiento/>} />  
        <Route path='/Pagos' element={<EmitirPago/>}/>  
      </Routes> 
    </>
    
  )
}

export default App
