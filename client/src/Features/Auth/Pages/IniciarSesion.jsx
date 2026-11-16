import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, User } from "lucide-react";
import { AuthForm, InputField } from "../components/AuthForm";
import { useAuth } from "../Context/AuthContext";
import { authService } from "../services/authService";

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

  const handleSubmit = async (e) => {
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

  const quickLogin = async (email, pass) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.login(email, pass);
      login(session);
      navigate("/Inicio");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión con este usuario de prueba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Iniciar sesión"
        subtitle="Accede a tu cuenta para gestionar tus boletos"
        onSubmit={handleSubmit}
        submitText={loading ? "Iniciando sesión..." : "Iniciar sesión"}
        footer={
          <>
            <div className="mb-2">
              ¿No tienes cuenta?{" "}
              <Link to="/Registro" className="font-medium text-orange-600 hover:text-orange-700">
                Regístrate
              </Link>
            </div>
            <Link to="/RecuperarContrasena" className="font-medium text-orange-600 hover:text-orange-700">
              ¿Olvidaste tu contraseña?
            </Link>
          </>
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <InputField
          label="Correo electrónico"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          icon={Mail}
        />
        <InputField
          label="Contraseña"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          icon={Lock}
        />
      </AuthForm>

      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <p className="text-xs font-medium text-gray-600 mb-3">Acceso rápido (usuarios de prueba en base de datos)</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => quickLogin("admin1@ejemplo.com", "hashed_password_123")}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors disabled:opacity-60"
              type="button"
            >
              <Shield className="h-3.5 w-3.5" />
              Administrador
            </button>
            <button
              onClick={() => quickLogin("organizer1@ejemplo.com", "hashed_password_123")}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors disabled:opacity-60"
              type="button"
            >
              <User className="h-3.5 w-3.5" />
              Organizador
            </button>
            <button
              onClick={() => quickLogin("customer1@ejemplo.com", "hashed_password_123")}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors disabled:opacity-60"
              type="button"
            >
              <User className="h-3.5 w-3.5" />
              Cliente
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Estos accesos usan los usuarios insertados por inserts.sql en PostgreSQL.
          </p>
        </div>
      </div>
    </>
  );
}

export default IniciarSesion;
