import { TicketCheck } from "lucide-react";

function Header() {
    return ( 
    <nav className="">
        <div className="flex gap-1 place-items-center m-2">
             <TicketCheck className="size-12 text-white bg-amber-500 p-2 rounded-3xl"/> <h1 className="text-2xl font-black">TIKETEKA</h1>
        </div>
    </nav>
    );
}

export default Header;