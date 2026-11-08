function Footer() {
    return (
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">TIKETEKA</span>
              <span className="text-sm text-gray-500">© 2026 Todos los derechos reservados</span>
            </div>
            <div className="text-sm text-gray-600 text-center md:text-right">
              <p>Plataforma de Ticketing y Asignación de Asientos Dinámica</p>
              <p className="text-xs text-gray-500 mt-1">Programación Web 2026 © - Escola, Pedrique, Zambuchini</p>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer;