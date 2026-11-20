import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { authService } from "../services/authService";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

function IniciarSesion() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmitold = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await authService.login(formData.email, formData.password);
      login(session);
      navigate("/Inicio");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
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
            <EmailInput/>
            <PasswordInput/>
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
    </>
  );
}

export default IniciarSesion;
