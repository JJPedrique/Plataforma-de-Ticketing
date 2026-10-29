import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { AuthForm, InputField } from '../components/AuthForm';
import { authService } from '../services/authService';

function RestablecerContrasena() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      if (!token) {
        setError('No se encontró el token de recuperación.');
        setChecking(false);
        return;
      }

      const saved = localStorage.getItem(`recovery_${token}`);
      if (!saved) {
        setError('El token es inválido o ya fue usado.');
        setChecking(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        if (Date.now() > parsed.expiresAt) {
          localStorage.removeItem(`recovery_${token}`);
          setError('El token ha expirado. Solicita uno nuevo.');
          setChecking(false);
          return;
        }
        setIsValid(true);
      } catch {
        setError('El token es inválido.');
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValid) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      authService.resetPassword(token, formData.password);
      navigate('/IniciarSesion');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-10">
        <p className="text-sm text-gray-600">Verificando token...</p>
      </div>
    );
  }

  return (
    <AuthForm
      title="Restablecer contraseña"
      subtitle={isValid ? 'Ingresa tu nueva contraseña' : 'No se puede restablecer la contraseña'}
      onSubmit={handleSubmit}
      submitText={loading ? 'Restableciendo...' : 'Restablecer contraseña'}
      footer={
        <Link to="/RecuperarContrasena" className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700">
          <ArrowLeft className="h-4 w-4" />
          Solicitar nuevo enlace
        </Link>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {isValid && (
        <>
          <InputField
            label="Nueva contraseña"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
            icon={Lock}
          />
          <InputField
            label="Confirmar nueva contraseña"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu nueva contraseña"
            icon={Lock}
          />
          <p className="text-xs text-gray-500">
            La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
          </p>
        </>
      )}
    </AuthForm>
  );
}

export default RestablecerContrasena;
