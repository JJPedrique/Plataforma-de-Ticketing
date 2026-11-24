import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/authService';
import { useAuth } from '../Context/AuthContext';
import RegistroForm from '../../../shared/components/RegistroForm';
import Modal from '../../../shared/components/Modal';
import { getErrorMessage } from '../../../shared/api/http';
import { X } from 'lucide-react';

function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleError = (errorMessage) => {
    setMessage(errorMessage);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setMessage('');
    try {
      const data = await userService.register({
        first_name: values.first_name,
        last_name: values.last_name,
        cedula: values.cedula,
        email: values.email,
        password: values.password,
      });
      login(data);
      navigate('/Inicio');
    } catch (error) {
      handleError(getErrorMessage(error, 'Ocurrió un error al registrar.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 space-y-2">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Crear cuenta</h1>
            <p className="mt-2 text-sm text-gray-600">Regístrate para comprar tus boletos</p>
          </div>

          <RegistroForm
            onSubmit={handleSubmit}
            onError={handleError}
            loading={loading}
            submitLabel="Registrar Cuenta"
            loadingLabel="Registrando..."
            idPrefix="registro"
          />

          <div className="text-center space-y-1 pt-3">
            ¿Ya tienes cuenta?
            <Link to="/IniciarSesion" className="pl-3 font-medium text-orange-600 hover:text-orange-700">Iniciar sesión</Link>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} title="Error de Registro" onClose={() => setIsModalOpen(false)}
        children={
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <X />
            </div>
            <div>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        }
      />
    </>
  );
}

export default Registro;
