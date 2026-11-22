import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../../Auth/services/authService';
import { useAuth } from '../../Auth/Context/AuthContext';
import Modal from '../../../shared/components/Modal';
import { X } from 'lucide-react';
import TextInput from '../../Auth/components/TextInput';
import CedulaInput from '../../Auth/components/CedulaInput';

function getRoleLabel(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'admin') return 'Administrador';
  if (r === 'organizer') return 'Organizador';
  if (r === 'user' || r === 'client' || r === 'customer') return 'Cliente';
  return role || 'Usuario';
}

function Perfil() {
  const { user, login, logout, refreshUser } = useAuth();

  const [loading,setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [message, setMessage] = useState("");

  const [firstName,setFirstName] = useState(user.first_name);
  const [lastName,setLastName] = useState(user.last_name);
  const [cedula,setCedula] = useState(user.cedula);

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const initials = useMemo(() => {
    const base = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'U';
    return base.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }, [user?.name, user?.first_name, user?.last_name]);

  const handleCancelEdit = () => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setCedula(user.cedula);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    try {
      setLoading(true);
      const data = await userService.update(user.id,{...user, first_name : firstName, last_name : lastName,  cedula:cedula});
      login(data);
      navigate("/Perfil");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Ocurrió un error al registrar.";
      setMessage(errorMsg);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (loading) return;
  
    try {
      setLoading(true);
      await userService.delete(user.id);
      logout();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Ocurrió un error al registrar.";
      setMessage(errorMsg);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Mi perfil</h1>
        <p className="text-gray-700 mt-2">Administra tu información personal y la configuración de tu cuenta.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-14 md:size-16 rounded-full bg-orange-600 text-white font-semibold text-lg md:text-xl shrink-0" aria-hidden="true">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-gray-900 truncate">{user.first_name+" "+user.last_name}</p>
              <p className="text-gray-600 truncate">{user.email}</p>
              <p className="text-sm text-gray-500 mt-0.5">{getRoleLabel(user.role)}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="info-personal-title" className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 id="info-personal-title" className="text-xl font-semibold text-gray-900">Información personal</h2>
              <p className="text-sm text-gray-600 mt-1">Mantén tus datos actualizados. Tu correo electrónico no se puede cambiar.</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={()=>setIsEditing(true)}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 shrink-0"
              >
                Modificar información
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                {isEditing ? (
                  <TextInput label="Nombre" setValue={setFirstName} initialValue={user.first_name}/>
                ) : (
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1.5">Nombre</label>
                  <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-12.5 flex items-center">
                    {user.first_name || '—'}
                  </div>
                </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <TextInput label="Apellido" setValue={setLastName} initialValue={user.last_name}/>
                ) : (
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1.5">Apellido</label>
                  <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-12.5 flex items-center">
                    {user.last_name || '—'}
                  </div>
                </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div>
                  {isEditing ? (
                      <CedulaInput label="Cedula" setValue={setCedula} initialValue={user.cedula}/>
                    ) : (
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1.5">Cedula</label>
                      <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-12.5 flex items-center">
                        {user.cedula || '—'}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-900 mb-1.5">Correo electrónico</span>
                  <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 min-h-12.5 flex items-center">
                    {user.email}
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5">Usamos este correo para iniciar sesión y enviarte notificaciones importantes.</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-5 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                type="button" onClick={handleCancelEdit} disabled={loading}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            )}
          </form>
        </section>

        <section aria-labelledby="cuenta-title" className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex flex-col gap-4">
            <div>
              <h2 id="cuenta-title" className="text-xl font-semibold text-gray-900">Cuenta</h2>
              <p className="text-gray-700 mt-1 max-w-2xl">
                Si desactivas tu cuenta, se cerrará tu sesión y no podrás acceder hasta solicitar ayuda para reactivarla.
              </p>
            </div>

            {!confirmDelete ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-red-700 border border-red-300 font-medium rounded-md hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                >
                  Desactivar cuenta
                </button>
              </div>
            ) : (
              <div className="border border-red-200 bg-red-50 rounded-lg p-4 md:p-5" role="group" aria-label="Confirmación para desactivar cuenta">
                <p className="text-red-900 font-medium">¿Quieres desactivar tu cuenta?</p>
                <p className="text-sm text-red-800 mt-1">Esta acción cerrará tu sesión de inmediato.</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  >
                    Sí, desactivar cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-gray-800 border border-gray-300 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                  >
                    Mantener mi cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} title="Error de Registro" onClose={() => setIsModalOpen(false)}
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
    </div>

    
  );
}

export default Perfil;
