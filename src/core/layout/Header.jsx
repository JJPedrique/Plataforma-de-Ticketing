import { TicketCheck } from "lucide-react";
import { Link, NavLink } from 'react-router'

function Header() {
    return (
    <header className="sticky top-0 z-20 bg-background/85 backdrop-blur">
      <div className="mx-auto flex flex-wrap items-center gap-3 px-6 py-4">
        <Link to="/Inicio" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-amber-500 text-primary-foreground">
            <TicketCheck className="size-5 text-white" />
          </span>
          <span>
            <span className="block text-xl leading-tight font-bold tracking-tight">TIKETEKA</span>
            <span className="block text-xs text-muted-foreground">Plataforma de Ticketing y Asignación de Asientos Dinámica para Eventos</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">

        </nav>
      </div>
    </header>
    );
}

export default Header;
