import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import EmailInput from '../components/EmailInput';
import CedulaInput from '../components/CedulaInput';
import PasswordInput from '../components/PasswordInput';
import { userService } from '../services/authService';
import Modal from '../../../shared/components/Modal';

function RestablecerContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
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
      await userService.newPassword({
        cedula: cedula,
        email : email,
        password: password,
        confirmPassword: confirmPassword
      } );
      window.alert("Contraseña cambiada")
      navigate("/Inicio");

    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Ocurrió un error al recuperar cuenta.";
      setMessage(errorMsg);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Recuperar contraseña</h1>
          </div>         
          
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="mt-2 text-sm text-center text-gray-600">Ingresa tu correo electrónico y tu cedula para verificar la cuenta</p>
              <CedulaInput label="Cedula" setValue={setCedula}/>
              <EmailInput label="Correo electrónico" setValue={setEmail}/>
              <p className="mt-3 text-sm text-center text-gray-600">Ingresa los datos de la nueva contraseña</p>
              <PasswordInput label="Nueva Contraseña" setValue={setPassword}/>
              <PasswordInput label="Confirmar Nueva Contraseña" setValue={setConfirmPassword}/>
              <button type="submit" className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                {loading ? "Restableciendo..." : "Restablecer cuenta"}
              </button>
            </form>
            
            <div className="text-center space-y-1 pt-3">
              <Link to="/IniciarSesion" className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700">
                <ArrowLeft className="h-4 w-4" />
                Volver a iniciar sesión
              </Link>
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
    </>);
}

export default RestablecerContrasena;
