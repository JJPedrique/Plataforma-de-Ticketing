import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmailInput from '../components/EmailInput';

function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    try {
      setLoading(true);
      const data = await userService.register({email : email} );
      window.alert("A falta de presupuesto, tu contraseña es:"+data)
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
            <p className="mt-2 text-sm text-gray-600">Ingresa tu correo electrónico para recibir un enlace de recuperación</p>
          </div>         
          
            <form onSubmit={handleSubmit} className="space-y-4">
              <EmailInput label="Correo electrónico" setValue={setEmail}/>
            </form>
            
            <div className="text-center space-y-1 pt-3">
              <Link to="/IniciarSesion" className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700">
                <ArrowLeft className="h-4 w-4" />
                Volver a iniciar sesión
              </Link>
          </div>
        </div>
      </div>
    </>);
}

export default RecuperarContrasena;
