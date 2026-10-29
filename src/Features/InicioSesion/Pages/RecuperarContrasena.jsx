import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthForm, InputField } from '../components/AuthForm';
import { authService } from '../services/authService';

function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);
    try {
      const result = authService.requestPasswordRecovery(email);
      setSuccess(result.message);
      if (result.token) {
        setTimeout(() => {
          navigate(`/RestablecerContrasena?token=${result.token}`);
        }, 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo electrónico para recibir un enlace de recuperación"
      onSubmit={handleSubmit}
      submitText={loading ? 'Enviando...' : 'Enviar enlace'}
      footer={
        <Link to="/IniciarSesion" className="inline-flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700">
          <ArrowLeft className="h-4 w-4" />
          Volver a iniciar sesión
        </Link>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="status">
          {success}
        </div>
      )}
      <InputField
        label="Correo electrónico"
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
          setSuccess('');
        }}
        placeholder="tu@correo.com"
        icon={Mail}
      />
    </AuthForm>
  );
}

export default RecuperarContrasena;
