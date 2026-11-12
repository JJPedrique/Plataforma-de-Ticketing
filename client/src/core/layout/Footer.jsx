import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/Inicio" className="inline-block mb-3 text-lg font-bold text-gray-900">
              TIKETEKA
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Plataforma de ticketing y asignación de asientos para eventos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/Inicio" className="text-gray-600 hover:text-orange-700">Inicio</Link></li>
              <li><Link to="/Cliente/Ticketing" className="text-gray-600 hover:text-orange-700">Eventos y boletos</Link></li>
              <li><Link to="/MisTickets" className="text-gray-600 hover:text-orange-700">Mis tickets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Información</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/AcercaDeNosotros" className="text-gray-600 hover:text-orange-700">Acerca de nosotros</Link></li>
              <li><Link to="/PreguntasFrecuentes" className="text-gray-600 hover:text-orange-700">Preguntas frecuentes</Link></li>
              <li><Link to="/Contacto" className="text-gray-600 hover:text-orange-700">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/Politicas" className="text-gray-600 hover:text-orange-700">Políticas</Link></li>
              <li><Link to="/Politicas#privacidad" className="text-gray-600 hover:text-orange-700">Privacidad y datos</Link></li>
              <li><Link to="/Politicas#cookies" className="text-gray-600 hover:text-orange-700">Cookies</Link></li>
              <li><Link to="/Politicas#derechos" className="text-gray-600 hover:text-orange-700">Derechos del usuario</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 TIKETEKA. Todos los derechos reservados.</p>
          <p className="text-center md:text-right">Programación Web 2026 © - Escola, Pedrique, Zambuchini</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;