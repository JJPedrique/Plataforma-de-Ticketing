import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { AuthForm, InputField } from '../components/AuthForm';
import { authService } from '../services/authService';

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/Cliente/Ticketing');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Crear cuenta"
      subtitle="Regístrate para comprar tus boletos"
      onSubmit={handleSubmit}
      submitText={loading ? 'Registrando...' : 'Registrarse'}
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/IniciarSesion" className="font-medium text-amber-600 hover:text-amber-700">
            Iniciar sesión
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
        label="Nombre completo"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ingresa tu nombre"
        icon={User}
      />
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
        placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
        icon={Lock}
      />
      <InputField
        label="Confirmar contraseña"
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Repite tu contraseña"
        icon={Lock}
      />
      <p className="text-xs text-gray-500">
        La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
      </p>
    </AuthForm>
  );
}

export default Registro;
