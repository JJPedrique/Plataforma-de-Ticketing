import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { userService } from "../services/authService";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import { X } from "lucide-react";
import Modal from "../../../shared/components/Modal";

function IniciarSesion() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [message, setMessage] = useState("");
 
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const data = await userService.login({ email, password });
      login(data);
      navigate("/Inicio");
    } catch (error) {
      // Extrae el string de FastAPI (detail) o un mensaje genérico
      const errorMsg =
        error.response?.data?.detail ||
        error.message ||
        "Ocurrió un error al iniciar sesión.";

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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Iniciar sesión</h1>
            <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para gestionar tus boletos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailInput label="Correo Electronico" setValue={setEmail}/>
            <PasswordInput label="Contraseña" setValue={setPassword}/>
            <button type="submit" className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
          
          <div className="text-center space-y-1 pt-3">
            <div>
                ¿No tienes cuenta?
                <Link to="/Registro" className="pl-3 font-medium text-orange-600 hover:text-orange-700">Regístrate</Link>
            </div>
            <Link to="/RecuperarContrasena" className="font-medium text-orange-600 hover:text-orange-700"> ¿Olvidaste tu contraseña? </Link>     
          </div>
        </div>
      </div>
 
      <Modal isOpen={isModalOpen} title="Error de Autenticación" onClose={() => setIsModalOpen(false)}
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

export default IniciarSesion;
