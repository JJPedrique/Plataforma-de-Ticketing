import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { AuthForm, InputField } from '../components/AuthForm';
import { authService } from '../services/authService';
import { useAuth } from '../Context/AuthContext';

function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const firstName = authService.normalizePersonName(formData.firstName);
    const lastName = authService.normalizePersonName(formData.lastName);
    const email = String(formData.email || '').trim().toLowerCase();

    try {
      authService.validatePersonName(firstName, 'nombre');
      authService.validatePersonName(lastName, 'apellido');
    } catch (err) {
      setError(err.message);
      return;
    }

    if (!email) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      authService.validatePassword(formData.password);
    } catch (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    try {
      const session = await authService.register({
        firstName,
        lastName,
        email,
        password: formData.password,
      });
      login(session);
      navigate('/Inicio');
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro.');
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
          <Link to="/IniciarSesion" className="font-medium text-orange-600 hover:text-orange-700">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Nombre"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ingresa tu nombre"
          icon={User}
          required
          autoComplete="given-name"
          minLength={2}
          maxLength={100}
          pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+"
          title="Usa solo letras, espacios, apóstrofes o guiones (mínimo 2 caracteres)."
        />
        <InputField
          label="Apellido"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Ingresa tu apellido"
          icon={User}
          required
          autoComplete="family-name"
          minLength={2}
          maxLength={100}
          pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+"
          title="Usa solo letras, espacios, apóstrofes o guiones (mínimo 2 caracteres)."
        />
      </div>
      <InputField
        label="Correo electrónico"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="tu@correo.com"
        icon={Mail}
        required
        autoComplete="email"
        maxLength={255}
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
        required
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
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
        required
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
      />
    </AuthForm>
  );
}

export default Registro;
