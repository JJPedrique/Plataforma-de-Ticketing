import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, UserCog, User } from "lucide-react";
import { AuthForm, InputField } from "../components/AuthForm";
import { authService } from "../services/authService";

function IniciarSesion() {
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
    setError("");
    setLoading(true);

    try {
      const session = authService.login(formData.email, formData.password);

      if (session.role === "admin") {
        navigate("/Admin");
      } else {
        navigate("/Cliente/Ticketing");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, pass) => {
    setFormData({ email, password: pass });
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
              <Link to="/Registro" className="font-medium text-amber-600 hover:text-amber-700">
                Regístrate
              </Link>
            </div>
            <Link to="/RecuperarContrasena" className="font-medium text-amber-600 hover:text-amber-700">
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
          <p className="text-xs font-medium text-gray-600 mb-3">Acceso rápido (datos de prueba)</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => quickLogin("alice@example.com", "hash_123")}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors"
              type="button"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </button>
            {/* <button
              onClick={() => quickLogin("bob@example.com", "hash_123")}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors"
              type="button"
            >
              <UserCog className="h-3.5 w-3.5" />
              Organizador/Operador
            </button> */}
            <button
              onClick={() => quickLogin("charlie@example.com", "hash_123")}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors"
              type="button"
            >
              <User className="h-3.5 w-3.5" />
              Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default IniciarSesion;
