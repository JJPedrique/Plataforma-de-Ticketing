import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: '¿Necesito una cuenta para comprar boletos?',
    a: 'Sí. Debes iniciar sesión para acceder al flujo de compra, seleccionar asientos y completar el pago.',
  },
  {
    q: '¿Puedo elegir mis asientos?',
    a: 'Sí. La plataforma incluye un mapa interactivo para seleccionar asientos disponibles antes de continuar con el pago.',
  },
  {
    q: '¿Cuánto tiempo tengo para completar el pago?',
    a: 'En el flujo de pago se muestra un tiempo límite para completar la transacción. Si expira, deberás reiniciar el proceso.',
  },
  {
    q: '¿Dónde puedo ver mis compras?',
    a: 'Puedes consultar tus compras en la sección "Mis tickets" cuando hayas iniciado sesión.',
  },
  {
    q: '¿Qué métodos de pago están disponibles?',
    a: 'El flujo actual muestra opciones como tarjeta, Zelle, Pago Móvil, Binance Pay y PayPal como parte de una simulación.',
  },
  {
    q: '¿Qué hago si tengo un problema con mi compra?',
    a: 'Puedes comunicarte a través de la página de Contacto para solicitar ayuda o realizar una consulta.',
  },
];

function PreguntasFrecuentes() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      <header className="mb-8 md:mb-10">
        <nav aria-label="Ruta de navegación" className="text-sm text-gray-600 mb-4">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/Inicio" className="text-gray-700 hover:text-orange-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Preguntas frecuentes</li>
          </ol>
        </nav>
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Preguntas frecuentes</h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
            Encuentra respuestas rápidas sobre el uso de la plataforma, la compra de boletos y el acceso a tu cuenta.
          </p>
        </div>
      </header>

      <section aria-label="Listado de preguntas frecuentes" className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const buttonId = `faq-button-${idx}`;
          return (
            <div key={idx}>
              <h2>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-start justify-between gap-6 text-left px-5 md:px-6 py-4 md:py-5 hover:bg-gray-50 focus:outline-none focus-visible:bg-orange-50"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="font-semibold text-gray-900 leading-snug">{item.q}</span>
                  <span aria-hidden="true" className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 text-gray-700 text-base shrink-0 mt-0.5">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h2>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={isOpen ? 'px-5 md:px-6 pb-5 md:pb-6' : ''}
              >
                {isOpen && <p className="text-gray-700 leading-relaxed max-w-3xl">{item.a}</p>}
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">¿Necesitas más ayuda?</h2>
        <p className="text-gray-700 mb-4">Si tu consulta no aparece aquí, puedes escribirnos y te responderemos a la brevedad.</p>
        <Link
          to="/Contacto"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
        >
          Ir a Contacto
        </Link>
      </div>
    </div>
  );
}

export default PreguntasFrecuentes;
