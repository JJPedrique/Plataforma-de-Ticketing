import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from '../../../shared/validation/rules';

function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      <header className="mb-8 md:mb-10">
        <nav aria-label="Ruta de navegación" className="text-sm text-gray-600 mb-4">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/Inicio" className="text-gray-700 hover:text-orange-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Contacto</li>
          </ol>
        </nav>
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Contacto</h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
            Comunícate con nosotros para soporte, consultas sobre la plataforma o información general.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
        <aside aria-label="Información de contacto" className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Correo electrónico</h2>
            <p className="text-gray-700">
              <a href="mailto:soporte@tiketeka.com" className="text-orange-700 hover:text-orange-800 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">soporte@tiketeka.com</a>
            </p>
            <p className="text-sm text-gray-600 mt-2">Tiempo estimado de respuesta: 24–48 horas hábiles.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Teléfono</h2>
            <p className="text-gray-700">
              <a href="tel:+582121234567" className="text-orange-700 hover:text-orange-800 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">+58 (212) 123-4567</a>
            </p>
            <p className="text-sm text-gray-600 mt-2">Lunes a viernes, 9:00 a 17:00 (VET).</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Ubicación</h2>
            <p className="text-gray-700">5 de Julio, Maracaibo, Venezuela</p>
            <p className="text-sm text-gray-600 mt-2">Atención principalmente por canales digitales.</p>
          </div>
        </aside>

        <section aria-label="Formulario de contacto" className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Enviar un mensaje</h2>
          <p className="text-gray-700 mb-6">Completa los campos del formulario. Los campos marcados son obligatorios.</p>

          {enviado ? (
            <div role="status" aria-live="polite" className="border border-green-300 bg-green-50 rounded-lg p-5 text-green-900">
              <p className="font-semibold text-lg">Mensaje enviado correctamente</p>
              <p className="mt-1 text-green-800">Hemos recibido tu mensaje. Esta es una confirmación simulada en la versión actual de la plataforma.</p>
              <button
                type="button"
                onClick={() => {
                  setEnviado(false);
                  setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
                }}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-green-700 text-green-900 font-medium rounded-md hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-900 mb-1.5">Nombre <span aria-hidden="true">*</span></label>
                  <input
                    id="nombre"
                    name="nombre"
                    autoComplete="name"
                    maxLength={NAME_MAX_LENGTH}
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-900 mb-1.5">Correo electrónico <span aria-hidden="true">*</span></label>
                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    autoComplete="email"
                    maxLength={EMAIL_MAX_LENGTH}
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    placeholder="nombre@ejemplo.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-900 mb-1.5">Asunto <span aria-hidden="true">*</span></label>
                <input
                  id="asunto"
                  name="asunto"
                  maxLength={CONTACT_SUBJECT_MAX_LENGTH}
                  value={form.asunto}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Motivo de tu mensaje"
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-900 mb-1.5">Mensaje <span aria-hidden="true">*</span></label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 resize-y"
                  placeholder="Describe tu consulta con el mayor detalle posible"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                >
                  Enviar mensaje
                </button>
                <p className="text-sm text-gray-600">Responderemos al correo proporcionado.</p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default Contacto;
