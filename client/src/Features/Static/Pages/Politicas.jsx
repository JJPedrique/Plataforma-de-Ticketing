import { Link } from 'react-router-dom';

const secciones = [
  { id: 'privacidad', label: 'Privacidad y datos' },
  { id: 'uso-informacion', label: 'Uso de la información' },
  { id: 'terceros', label: 'Terceros y organizadores' },
  { id: 'cookies', label: 'Cookies y almacenamiento' },
  { id: 'derechos', label: 'Derechos del usuario' },
  { id: 'cambios', label: 'Cambios en las políticas' },
];

function Politicas() {
  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      <header className="mb-8 md:mb-10">
        <nav aria-label="Ruta de navegación" className="text-sm text-gray-600 mb-4">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/Inicio" className="text-gray-700 hover:text-orange-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Políticas</li>
          </ol>
        </nav>
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Políticas de la plataforma</h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
            Información sobre privacidad, tratamiento de datos y condiciones de uso de TIKETEKA, presentada de forma clara y accesible.
          </p>
          <p className="text-sm text-gray-600 mt-4">Última actualización: <time dateTime="2026-11">noviembre de 2026</time></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
        <aside className="lg:sticky lg:top-24">
          <nav aria-label="Contenido de la página" className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">En esta página</h2>
            <ul className="space-y-1.5">
              {secciones.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-6">
          <section id="privacidad" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">1. Privacidad y datos que recopilamos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Recopilamos la información necesaria para operar la plataforma, gestionar cuentas y procesar compras.</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li><strong className="font-medium text-gray-900">Identidad y contacto:</strong> nombre, correo electrónico y datos de perfil.</li>
              <li><strong className="font-medium text-gray-900">Actividad en la plataforma:</strong> reservas, compras y selección de asientos.</li>
              <li><strong className="font-medium text-gray-900">Información técnica básica:</strong> datos necesarios para seguridad, sesión y funcionamiento del servicio.</li>
            </ul>
          </section>

          <section id="uso-informacion" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">2. Uso de la información</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Utilizamos los datos con las siguientes finalidades:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>Gestionar el registro, acceso y uso de la cuenta.</li>
              <li>Procesar reservas, pagos y mostrar el historial de compras.</li>
              <li>Enviar comunicaciones relacionadas con eventos y transacciones.</li>
              <li>Prevenir fraudes y mejorar la seguridad y el funcionamiento del servicio.</li>
            </ul>
          </section>

          <section id="terceros" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">3. Terceros y organizadores</h2>
            <p className="text-gray-700 leading-relaxed mb-4">No vendemos información personal. Podemos compartir datos únicamente cuando sea necesario para:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li><strong className="font-medium text-gray-900">Organizadores:</strong> control de acceso y gestión del evento.</li>
              <li><strong className="font-medium text-gray-900">Proveedores de pago:</strong> procesamiento de transacciones.</li>
              <li><strong className="font-medium text-gray-900">Obligaciones legales:</strong> cumplimiento de requerimientos de autoridades competentes.</li>
            </ul>
          </section>

          <section id="cookies" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">4. Cookies y almacenamiento local</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Podemos utilizar cookies y almacenamiento local para mantener la sesión, recordar preferencias y mejorar la experiencia de uso.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Puedes gestionar estas tecnologías desde la configuración de tu navegador. Algunas funciones pueden verse limitadas si las deshabilitas.
            </p>
          </section>

          <section id="derechos" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">5. Derechos del usuario</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Puedes solicitar acceso, rectificación, actualización o eliminación de tus datos personales, conforme a la normativa aplicable.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Para ejercer estos derechos, escríbenos desde la página de{' '}
              <Link to="/Contacto" className="text-orange-700 font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">Contacto</Link>.
            </p>
          </section>

          <section id="cambios" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">6. Cambios en las políticas</h2>
            <p className="text-gray-700 leading-relaxed">
              Estas políticas pueden actualizarse para reflejar cambios en el servicio o en la normativa. La versión vigente estará disponible en esta página con su fecha de actualización.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Politicas;
