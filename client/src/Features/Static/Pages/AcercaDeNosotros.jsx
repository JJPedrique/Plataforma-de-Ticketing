import { Link } from 'react-router-dom';

const secciones = [
  { id: 'quienes-somos', label: 'Quiénes somos' },
  { id: 'historia', label: 'Historia' },
  { id: 'alcance', label: 'Alcance' },
  { id: 'equipo', label: 'Equipo desarrollador' },
  { id: 'valores', label: 'Valores institucionales' },
];

function AcercaDeNosotros() {
  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      <header className="mb-8 md:mb-10">
        <nav aria-label="Ruta de navegación" className="text-sm text-gray-600 mb-4">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/Inicio" className="text-gray-700 hover:text-orange-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Acerca de nosotros</li>
          </ol>
        </nav>
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Acerca de nosotros</h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
            Conoce el propósito de TIKETEKA, su evolución, el alcance de la plataforma y el equipo que la desarrolla.
          </p>
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
          <section id="quienes-somos" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Quiénes somos</h2>
            <p className="text-gray-700 leading-relaxed">
              TIKETEKA es una plataforma de ticketing y asignación de asientos orientada a facilitar la compra y gestión de entradas para distintos tipos de eventos. Buscamos ofrecer un proceso claro, ordenado y accesible tanto para usuarios como para organizadores.
            </p>
          </section>

          <section id="historia" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Historia</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              El proyecto nace como una iniciativa académica de Programación Web 2026, enfocada en resolver necesidades comunes en la venta de boletos: visualización de disponibilidad, selección de asientos y seguimiento de compras.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Con el tiempo, se incorporaron módulos de autenticación, gestión de eventos, ticketing e historial, manteniendo una estructura modular para facilitar su evolución.
            </p>
          </section>

          <section id="alcance" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Alcance</h2>
            <p className="text-gray-700 leading-relaxed mb-4">La plataforma cubre las funciones principales del ciclo de venta y gestión de entradas:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>Registro e inicio de sesión de usuarios.</li>
              <li>Consulta de eventos y selección interactiva de asientos.</li>
              <li>Flujo de pago simulado y confirmación de reserva.</li>
              <li>Historial de compras y herramientas de gestión de eventos.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Actualmente opera con datos simulados como entorno de demostración, con posibilidad de integración futura con servicios reales.
            </p>
          </section>

          <section id="equipo" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Equipo desarrollador</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Sebastian Escola', 'Jose Pedrique', 'Maurizio Zambuchini'].map((name) => (
                <li key={name} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-700 mt-1">Desarrollador</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="valores" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Valores institucionales</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <dt className="font-semibold text-gray-900 mb-1">Transparencia</dt>
                <dd className="text-gray-700 leading-relaxed">Información clara durante el proceso de compra y uso de la plataforma.</dd>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <dt className="font-semibold text-gray-900 mb-1">Seguridad</dt>
                <dd className="text-gray-700 leading-relaxed">Cuidado de los datos y prácticas orientadas a un uso confiable.</dd>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <dt className="font-semibold text-gray-900 mb-1">Innovación</dt>
                <dd className="text-gray-700 leading-relaxed">Mejora continua de la experiencia de gestión y compra de boletos.</dd>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <dt className="font-semibold text-gray-900 mb-1">Compromiso</dt>
                <dd className="text-gray-700 leading-relaxed">Enfoque en calidad, utilidad y atención a las necesidades del usuario.</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AcercaDeNosotros;
