import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/authService';
import { useAuth } from '../Context/AuthContext';
import TextInput from '../components/TextInput';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import Modal from '../../../shared/components/Modal';
import { X } from 'lucide-react';
import CedulaInput from '../components/CedulaInput';

function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [cedula,setCedula] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
 
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    try {
      setLoading(true);

      if(password!==confirmPassword){
        const errorMsg = "Las Contraseña no coinciden.";

        setMessage(errorMsg);
        setIsModalOpen(true);
        return        
      }
   
      const data = await userService.register({ first_name : firstName, last_name : lastName, email : email, password : password});
      login(data);
      navigate("/Inicio");

    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Ocurrió un error al registrar.";
      setMessage(errorMsg);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 space-y-2">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Crear cuenta</h1>
            <p className="mt-2 text-sm text-gray-600">Regístrate para comprar tus boletos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Nombre" setValue={setFirstName}/>
              <TextInput label="Apellido" setValue={setLastName}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CedulaInput label="Cedula" setValue={setCedula}/>
              <EmailInput label="Correo electrónico" setValue={setEmail}/>
            </div>
            
            <PasswordInput label="Contraseña" setValue={setPassword}/>
            <PasswordInput label="Confirmar Contraseña" setValue={setConfirmPassword}/>
            <button type="submit" className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
              {loading ? "Registrando..." : "Registrar Cuenta"}
            </button>
          </form>

          <div className="text-center space-y-1 pt-3">
              ¿Ya tienes cuenta?
              <Link to="/IniciarSesion" className="pl-3 font-medium text-orange-600 hover:text-orange-700">Iniciar sesión</Link>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} title="Error de Registro" onClose={() => setIsModalOpen(false)}
        children={              
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <X/>
            </div>
            <div>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
            </div>
        </div>}/>
    </>
  );
}

export default Registro;
